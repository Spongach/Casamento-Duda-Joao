import { CONTENT } from "../../content.js";
import { $, el, iniciaPagina, cabecalho } from "../site.js";

if (iniciaPagina("homenagens")) {
  const H = CONTENT.homenagens;
  cabecalho(H.titulo, H.intro);
  $("grupos").replaceChildren(
    ...H.grupos.map((g) =>
      el("section", { id: g.id, className: "grupo" },
        el("h2", { textContent: g.titulo }),
        el("div", { className: "pessoas" },
          ...g.pessoas.map((p) =>
            el("article", { className: "pessoa" },
              el("img", { src: p.foto, alt: p.nome, loading: "lazy", onerror() { this.style.visibility = "hidden"; } }),
              el("h3", { textContent: p.nome }),
              el("small", { textContent: p.relacao }),
              el("p", { textContent: p.texto })
            )
          )
        )
      )
    )
  );
}
