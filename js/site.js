import { CONTENT } from "../content.js";

export const $ = (id) => document.getElementById(id);
export const fase = CONTENT.fase;

// Cria elemento com segurança (textContent, nunca innerHTML)
export function el(tag, props = {}, ...filhos) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k.startsWith("aria-") || k === "role") e.setAttribute(k, v);
    else e[k] = v;
  }
  e.append(...filhos.filter((f) => f !== null && f !== undefined && f !== false));
  return e;
}

// Link só vale se existir e não for placeholder [COLCHETES]
export const linkOk = (url) => Boolean(url) && !String(url).startsWith("[");

export function linkExterno(url, props = {}, ...filhos) {
  const externo = /^https?:/.test(url);
  return el("a", { href: url, ...(externo ? { target: "_blank", rel: "noopener" } : {}), ...props }, ...filhos);
}

// ---------- Menu ----------
const AMBAS = ["antes", "depois"];
const MENU = [
  { id: "casamento", rotulo: "Casamento", href: "index.html", fases: AMBAS },
  { id: "historia", rotulo: "Nossa história", href: "historia.html", fases: AMBAS },
  {
    id: "homenagens", rotulo: "Homenagens", href: "homenagens.html", fases: AMBAS,
    sub: CONTENT.homenagens.grupos.map((g) => ({ rotulo: g.titulo, href: `homenagens.html#${g.id}` })),
  },
  { id: "guia", rotulo: "Guia da cidade", href: "guia.html", fases: ["antes"] },
  { id: "presentes", rotulo: "Presentes", href: "presentes.html", fases: ["antes"] },
  { id: "mural", rotulo: "Mural de recados", href: "mural.html", fases: AMBAS },
  { id: "fotos", rotulo: "Fotos", href: "fotos.html", fases: ["depois"] },
  { id: "achados", rotulo: "Achados e perdidos", href: "achados.html", fases: ["depois"] },
  { id: "rsvp", rotulo: "Confirmar presença", href: "rsvp.html", fases: ["antes"], cta: true },
];

function montaNav(paginaId) {
  const header = el("header", { className: "topo" });
  const marca = el("a", { className: "marca", href: "index.html", textContent: CONTENT.noivos });
  const hamb = el("button", { type: "button", className: "hamb", textContent: "☰", "aria-label": "Abrir menu", "aria-expanded": "false" });
  const ul = el("ul", { className: "menu" });

  for (const item of MENU.filter((m) => m.fases.includes(fase))) {
    const li = el("li", { className: item.sub ? "tem-sub" : "" });
    const a = el("a", { href: item.href, textContent: item.rotulo, className: item.cta ? "cta" : "" });
    if (item.id === paginaId) a.setAttribute("aria-current", "page");
    li.append(a);

    if (item.sub) {
      const caret = el("button", { type: "button", className: "caret", textContent: "▾", "aria-label": `Abrir submenu ${item.rotulo}` });
      const sub = el("ul", { className: "sub" }, ...item.sub.map((s) => el("li", {}, el("a", { href: s.href, textContent: s.rotulo }))));
      caret.addEventListener("click", (ev) => { ev.stopPropagation(); li.classList.toggle("aberto"); });
      li.append(caret, sub);
    }
    ul.append(li);
  }

  hamb.addEventListener("click", () => {
    const aberto = header.classList.toggle("aberto");
    hamb.setAttribute("aria-expanded", String(aberto));
  });
  document.addEventListener("click", () => document.querySelectorAll(".tem-sub.aberto").forEach((x) => x.classList.remove("aberto")));

  header.append(marca, hamb, ul);
  return header;
}

// Chamar no começo de cada página. Retorna false se a página não existe na fase atual.
export function iniciaPagina(paginaId) {
  const item = MENU.find((m) => m.id === paginaId);
  document.title = `${item.rotulo} — ${CONTENT.noivos}`;
  $("nav").replaceChildren(montaNav(paginaId));
  const rodape = $("rodape");
  if (rodape) rodape.textContent = CONTENT.rodape;

  if (!item.fases.includes(fase)) {
    $("conteudo").replaceChildren(
      el("p", { className: "texto-centro", textContent: "Esta página não está disponível no momento." }),
      el("p", { className: "texto-centro" }, el("a", { href: "index.html", textContent: "Voltar ao início" }))
    );
    return false;
  }
  return true;
}

// Cabeçalho padrão das páginas internas
export function cabecalho(titulo, texto) {
  const h = $("titulo");
  if (h) h.textContent = titulo;
  const p = $("texto");
  if (p) p.textContent = texto || "";
}
