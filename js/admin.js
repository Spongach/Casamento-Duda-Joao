import { CONFIG } from "../config.js";
import { supabase, supabaseConfigurado } from "./supabase.js";
import { $, el } from "./site.js";

const botao = (texto, onClick, classe = "") =>
  el("button", { type: "button", textContent: texto, className: classe, onclick: onClick });
const dataBR = (iso) => new Date(iso).toLocaleDateString("pt-BR");

// ---------- Login ----------
if (!supabaseConfigurado) {
  $("loginErro").textContent = "Preencha SUPABASE_URL e SUPABASE_ANON_KEY em config.js.";
} else if (!supabase) {
  $("loginErro").textContent = "Não foi possível carregar o Supabase (confira sua internet).";
}

$("formLogin").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  $("loginErro").textContent = "";
  if (!supabase) return;
  const { error } = await supabase.auth.signInWithPassword({
    email: $("loginEmail").value.trim(),
    password: $("loginSenha").value,
  });
  if (error) { $("loginErro").textContent = "E-mail ou senha incorretos."; return; }
  await iniciaPainel();
});

$("btnSair").addEventListener("click", async () => {
  await supabase.auth.signOut();
  location.reload();
});

let painelAberto = false;
async function iniciaPainel() {
  if (painelAberto) return;
  const { data } = await supabase.auth.getSession();
  if (!data.session) return;

  // Confere se é admin de verdade (a RLS também protege no servidor): rsvps só admin lê
  const { error } = await supabase.from("ideias").select("id").limit(1);
  if (error) {
    $("loginErro").textContent = "Esse usuário não tem acesso ao painel.";
    await supabase.auth.signOut();
    return;
  }

  painelAberto = true;
  $("telaLogin").hidden = true;
  $("telaPainel").hidden = false;
  $("linkPlanilha").href = CONFIG.PLANILHA_URL;
  await Promise.all([carregaIdeias(), carregaPresentes(), carregaRsvp(), carregaRecados(), carregaAchados()]);
}

// ---------- Abas ----------
document.querySelectorAll(".abas button").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".abas button").forEach((x) => x.classList.toggle("ativa", x === b));
    document.querySelectorAll(".aba").forEach((a) => (a.hidden = a.id !== `aba-${b.dataset.aba}`));
  })
);

// ---------- Ideias ----------
async function carregaIdeias() {
  const { data, error } = await supabase.from("ideias").select("*").order("created_at", { ascending: false });
  if (error) return;
  $("listaIdeias").replaceChildren(
    ...data.map((i) =>
      el("li", {},
        el("div", {}, el("strong", { textContent: i.titulo }), el("p", { textContent: i.descricao || "" }),
          el("small", { textContent: `${i.autor || ""} · ${dataBR(i.created_at)}` })),
        botao("Excluir", async () => {
          if (!confirm("Excluir esta ideia?")) return;
          await supabase.from("ideias").delete().eq("id", i.id);
          carregaIdeias();
        }, "sec")
      )
    )
  );
}

$("formIdeia").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const { data } = await supabase.auth.getUser();
  const { error } = await supabase.from("ideias").insert({
    titulo: $("ideiaTitulo").value.trim(),
    descricao: $("ideiaDescricao").value.trim() || null,
    autor: data.user?.email ?? null,
  });
  if (!error) { ev.target.reset(); carregaIdeias(); }
});

// ---------- Presentes ----------
async function carregaPresentes() {
  const { data, error } = await supabase.from("presentes").select("*").order("ordem").order("created_at");
  if (error) return;
  const render = (publicado) =>
    data.filter((p) => p.publicado === publicado).map((p) =>
      el("li", {},
        p.imagem_url ? el("img", { src: p.imagem_url, alt: "" }) : null,
        el("div", {}, el("strong", { textContent: p.nome }), el("p", { textContent: p.descricao || "" }),
          el("small", { textContent: p.motivo || "" })),
        el("div", { className: "acoes" },
          botao(publicado ? "Despublicar" : "Publicar", async () => {
            await supabase.from("presentes").update({ publicado: !publicado }).eq("id", p.id);
            carregaPresentes();
          }, publicado ? "sec" : "ok"),
          botao("Excluir", async () => {
            if (!confirm("Excluir este presente?")) return;
            await supabase.from("presentes").delete().eq("id", p.id);
            carregaPresentes();
          }, "sec")
        )
      )
    );
  $("listaRascunhos").replaceChildren(...render(false));
  $("listaPublicados").replaceChildren(...render(true));
}

$("formPresente").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const { error } = await supabase.from("presentes").insert({
    nome: $("presNome").value.trim(),
    imagem_url: $("presImagem").value.trim() || null,
    link_url: $("presLink").value.trim() || null,
    descricao: $("presDescricao").value.trim() || null,
    motivo: $("presMotivo").value.trim() || null,
    publicado: false,
  });
  if (!error) { ev.target.reset(); carregaPresentes(); }
});

// ---------- Confirmações (RSVP) ----------
let rsvpsCache = [];
async function carregaRsvp() {
  const { data, error } = await supabase.from("rsvps").select("*").order("created_at", { ascending: false });
  if (error) return;
  rsvpsCache = data;

  const confirmados = data.filter((r) => r.vai);
  const pessoas = confirmados.reduce((n, r) => n + 1 + r.acompanhantes.length, 0);
  $("resumoRsvp").replaceChildren(
    el("div", {}, el("strong", { textContent: String(pessoas) }), "pessoas confirmadas"),
    el("div", {}, el("strong", { textContent: String(confirmados.length) }), "respostas “vou”"),
    el("div", {}, el("strong", { textContent: String(data.length - confirmados.length) }), "não vão")
  );

  $("listaRsvp").replaceChildren(
    ...data.map((r) =>
      el("li", {},
        el("div", {},
          el("strong", { textContent: `${r.vai ? "✅" : "❌"} ${r.nome}` }),
          r.acompanhantes.length ? el("p", { textContent: `Acompanhantes: ${r.acompanhantes.join(", ")}` }) : null,
          r.restricao ? el("p", { textContent: `Restrição: ${r.restricao}` }) : null,
          r.recado ? el("p", { textContent: `Recado: ${r.recado}` }) : null,
          el("small", { textContent: dataBR(r.created_at) })
        ),
        botao("Excluir", async () => {
          if (!confirm(`Excluir a resposta de ${r.nome}?`)) return;
          await supabase.from("rsvps").delete().eq("id", r.id);
          carregaRsvp();
        }, "sec")
      )
    )
  );
}

// Texto vindo de convidados pode começar com = + - @ (fórmula no Excel): neutraliza
const celulaCsv = (v) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replaceAll('"', '""')}"`;
};

$("btnCsv").addEventListener("click", () => {
  const linhas = [["Nome", "Vai?", "Acompanhantes", "Total de pessoas", "Restrição alimentar", "Recado", "Data"]];
  for (const r of rsvpsCache) {
    linhas.push([
      r.nome, r.vai ? "Sim" : "Não", r.acompanhantes.join(" | "),
      r.vai ? 1 + r.acompanhantes.length : 0, r.restricao, r.recado, dataBR(r.created_at),
    ]);
  }
  // ; como separador e BOM pra abrir certinho no Excel em português
  const csv = "﻿" + linhas.map((l) => l.map(celulaCsv).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = el("a", { href: url, download: "confirmacoes.csv" });
  a.click();
  URL.revokeObjectURL(url);
});

// ---------- Recados ----------
async function carregaRecados() {
  const { data, error } = await supabase.from("recados").select("*").order("created_at", { ascending: false });
  if (error) return;
  const render = (aprovado) =>
    data.filter((r) => r.aprovado === aprovado).map((r) =>
      el("li", {},
        el("div", {}, el("p", { textContent: r.mensagem }), el("small", { textContent: `— ${r.nome} · ${dataBR(r.created_at)}` })),
        el("div", { className: "acoes" },
          botao(aprovado ? "Ocultar" : "Aprovar", async () => {
            await supabase.from("recados").update({ aprovado: !aprovado }).eq("id", r.id);
            carregaRecados();
          }, aprovado ? "sec" : "ok"),
          botao("Excluir", async () => {
            if (!confirm("Excluir este recado?")) return;
            await supabase.from("recados").delete().eq("id", r.id);
            carregaRecados();
          }, "sec")
        )
      )
    );
  $("listaRecadosPendentes").replaceChildren(...render(false));
  $("listaRecadosAprovados").replaceChildren(...render(true));
}

// ---------- Achados e perdidos ----------
async function carregaAchados() {
  const { data, error } = await supabase.from("achados").select("*").order("created_at", { ascending: false });
  if (error) return;
  const render = (entregue) =>
    data.filter((i) => i.entregue === entregue).map((i) =>
      el("li", {},
        i.imagem_url ? el("img", { src: i.imagem_url, alt: "" }) : null,
        el("div", {}, el("strong", { textContent: i.titulo }), el("p", { textContent: i.descricao || "" })),
        el("div", { className: "acoes" },
          botao(entregue ? "Voltar pro site" : "Marcar entregue", async () => {
            await supabase.from("achados").update({ entregue: !entregue }).eq("id", i.id);
            carregaAchados();
          }, entregue ? "sec" : "ok"),
          botao("Excluir", async () => {
            if (!confirm("Excluir este item?")) return;
            await supabase.from("achados").delete().eq("id", i.id);
            carregaAchados();
          }, "sec")
        )
      )
    );
  $("listaAchadosAbertos").replaceChildren(...render(false));
  $("listaAchadosEntregues").replaceChildren(...render(true));
}

$("formAchado").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const { error } = await supabase.from("achados").insert({
    titulo: $("achTitulo").value.trim(),
    imagem_url: $("achImagem").value.trim() || null,
    descricao: $("achDescricao").value.trim() || null,
  });
  if (!error) { ev.target.reset(); carregaAchados(); }
});

// ---------- Sessão já ativa ----------
if (supabase) iniciaPainel();
