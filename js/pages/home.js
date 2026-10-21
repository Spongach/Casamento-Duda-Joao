import { CONTENT } from "../../content.js";
import { $, el, fase, iniciaPagina, linkOk, linkExterno } from "../site.js";

if (iniciaPagina("casamento")) {
  const botaoLink = (id, url) => {
    const a = $(id);
    if (linkOk(url)) { a.href = url; a.target = "_blank"; a.rel = "noopener"; a.hidden = false; }
  };

  // Capa
  $("frase").textContent = CONTENT.frase;
  $("noivos").textContent = CONTENT.noivos;
  $("data").textContent = CONTENT.dataTexto;
  $("boasVindas").textContent = CONTENT.textoBoasVindas;

  // Contador (antes) ou agradecimento (depois)
  if (fase === "depois") {
    $("contador").hidden = true;
    $("agradecimento").hidden = false;
    $("agradecimento").textContent = CONTENT.textoAgradecimento;
    $("boasVindas").parentElement.hidden = true;
  } else {
    const alvo = new Date(CONTENT.dataISO).getTime();
    const atualiza = () => {
      let falta = alvo - Date.now();
      if (falta <= 0) { $("contador").textContent = "É hoje! 💍"; return; }
      const d = Math.floor(falta / 86400000); falta %= 86400000;
      const h = Math.floor(falta / 3600000); falta %= 3600000;
      const m = Math.floor(falta / 60000);
      const s = Math.floor((falta % 60000) / 1000);
      $("contador").replaceChildren(
        ...[["dias", d], ["horas", h], ["min", m], ["seg", s]].map(([rotulo, n]) =>
          el("div", {}, el("strong", { textContent: String(n).padStart(2, "0") }), rotulo)
        )
      );
    };
    atualiza();
    setInterval(atualiza, 1000);
  }

  // Local
  const L = CONTENT.local;
  $("localNome").textContent = L.nome;
  $("localEndereco").textContent = L.endereco;
  $("localFoto").src = L.foto;
  if (L.aviso) { $("localAviso").textContent = L.aviso; $("localAviso").hidden = false; }
  botaoLink("btnMaps", L.mapsUrl);
  botaoLink("btnWaze", L.wazeUrl);

  // Caixinhas
  $("caixinhas").replaceChildren(
    ...CONTENT.caixinhas
      .filter((c) => c.fases.includes(fase))
      .map((c) => {
        const conteudo = [
          el("div", { className: "icone", textContent: c.icone }),
          el("h3", { textContent: c.titulo }),
          el("p", { textContent: c.texto }),
        ];
        return linkOk(c.url)
          ? linkExterno(c.url, { className: "caixinha" }, ...conteudo)
          : el("div", { className: "caixinha" }, ...conteudo);
      })
  );

  // Traje
  const T = CONTENT.traje;
  if (fase === "depois") {
    $("traje").hidden = true;
  } else {
    $("trajeTitulo").textContent = T.titulo;
    $("trajeTexto").textContent = T.texto;
    $("trajeEvitar").textContent = T.evitar;
    botaoLink("trajePinterest", T.pinterestUrl);
  }
}
