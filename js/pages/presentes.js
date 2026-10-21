import { CONTENT } from "../../content.js";
import { $, el, iniciaPagina, cabecalho, linkOk, linkExterno } from "../site.js";
import { supabase } from "../supabase.js";

if (iniciaPagina("presentes")) {
  const P = CONTENT.presentes;
  cabecalho(P.titulo, P.textoIntro);
  $("presentesPresencial").textContent = P.textoPresencial;

  const vazio = () => { $("vazio").textContent = P.vazio; $("vazio").hidden = false; };

  if (!supabase) vazio();
  else {
    const { data, error } = await supabase
      .from("presentes")
      .select("nome, descricao, motivo, imagem_url, link_url")
      .eq("publicado", true)
      .order("ordem", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data?.length) vazio();
    else {
      $("gridPresentes").replaceChildren(
        ...data.map((p) => {
          const filhos = [
            p.imagem_url ? el("img", { src: p.imagem_url, alt: p.nome, loading: "lazy" }) : null,
            el("div", {},
              el("h3", { textContent: p.nome }),
              p.descricao ? el("p", { textContent: p.descricao }) : null,
              p.motivo ? el("p", { className: "motivo", textContent: p.motivo }) : null,
              linkOk(p.link_url) ? el("small", { textContent: "Ver na loja →" }) : null
            ),
          ];
          return linkOk(p.link_url)
            ? linkExterno(p.link_url, { className: "presente" }, ...filhos)
            : el("div", { className: "presente" }, ...filhos);
        })
      );
    }
  }
}
