import { CONTENT } from "../../content.js";
import { $, el, iniciaPagina, cabecalho } from "../site.js";

if (iniciaPagina("historia")) {
  const H = CONTENT.historia;
  cabecalho(H.titulo, H.texto);
  $("timeline").replaceChildren(
    ...H.linhaDoTempo.map((m) =>
      el("li", { className: "marco" },
        el("span", { className: "marco__data", textContent: m.data }),
        el("div", { className: "marco__corpo" },
          m.foto ? el("img", { src: m.foto, alt: m.titulo, loading: "lazy" }) : null,
          el("h3", { textContent: m.titulo }),
          el("p", { textContent: m.texto })
        )
      )
    )
  );
}
