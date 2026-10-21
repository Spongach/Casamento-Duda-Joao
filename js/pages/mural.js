import { CONTENT } from "../../content.js";
import { $, el, iniciaPagina, cabecalho } from "../site.js";
import { supabase } from "../supabase.js";

if (iniciaPagina("mural")) {
  const M = CONTENT.mural;
  cabecalho(M.titulo, M.texto);

  async function carrega() {
    if (!supabase) { $("vazio").textContent = M.vazio; $("vazio").hidden = false; return; }
    const { data, error } = await supabase
      .from("recados")
      .select("nome, mensagem, created_at")
      .eq("aprovado", true)
      .order("created_at", { ascending: false });
    if (error || !data?.length) { $("vazio").textContent = M.vazio; $("vazio").hidden = false; return; }
    $("vazio").hidden = true;
    $("listaRecados").replaceChildren(
      ...data.map((r) =>
        el("article", { className: "recado" },
          el("p", { textContent: r.mensagem }),
          el("small", { textContent: `— ${r.nome}` })
        )
      )
    );
  }

  $("formRecado").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const status = $("recStatus");
    status.textContent = "";
    if ($("recSite").value) return; // isca anti-robô preenchida
    if (!supabase) { status.textContent = "O mural ainda não está configurado."; return; }

    const { error } = await supabase.from("recados").insert({
      nome: $("recNome").value.trim(),
      mensagem: $("recMsg").value.trim(),
    });
    if (error) { status.textContent = "Não foi possível enviar. Tente de novo em instantes."; return; }
    ev.target.reset();
    status.textContent = M.msgEnviado;
  });

  carrega();
}
