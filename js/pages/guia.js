import { CONTENT } from "../../content.js";
import { $, el, iniciaPagina, cabecalho, linkOk, linkExterno } from "../site.js";

if (iniciaPagina("guia")) {
  const G = CONTENT.guia;
  cabecalho(G.titulo, G.intro);
  $("categorias").replaceChildren(
    ...G.categorias.map((c) =>
      el("section", { className: "grupo" },
        el("h2", { textContent: c.titulo }),
        el("div", { className: "caixinhas" },
          ...c.itens.map((i) => {
            const filhos = [
              el("h3", { textContent: i.nome }),
              el("p", { textContent: i.descricao }),
              linkOk(i.url) ? el("small", { textContent: "Ver no mapa →" }) : null,
            ];
            return linkOk(i.url)
              ? linkExterno(i.url, { className: "caixinha" }, ...filhos)
              : el("div", { className: "caixinha" }, ...filhos);
          })
        )
      )
    )
  );
}
