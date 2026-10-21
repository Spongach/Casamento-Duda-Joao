import { CONTENT } from "../../content.js";
import { $, el, iniciaPagina, cabecalho } from "../site.js";
import { supabase } from "../supabase.js";

if (iniciaPagina("achados")) {
  const A = CONTENT.achados;
  cabecalho(A.titulo, A.texto);
  $("contato").textContent = A.contato;

  const vazio = () => { $("vazio").textContent = A.vazio; $("vazio").hidden = false; };

  if (!supabase) vazio();
  else {
    const { data, error } = await supabase
      .from("achados")
      .select("titulo, descricao, imagem_url")
      .eq("entregue", false)
      .order("created_at", { ascending: false });

    if (error || !data?.length) vazio();
    else {
      $("listaAchados").replaceChildren(
        ...data.map((i) =>
          el("div", { className: "presente" },
            i.imagem_url ? el("img", { src: i.imagem_url, alt: i.titulo, loading: "lazy" }) : null,
            el("div", {}, el("h3", { textContent: i.titulo }), i.descricao ? el("p", { textContent: i.descricao }) : null)
          )
        )
      );
    }
  }
}
