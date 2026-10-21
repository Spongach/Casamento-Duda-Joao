import { CONTENT } from "../../content.js";
import { $, iniciaPagina, cabecalho, linkOk } from "../site.js";

if (iniciaPagina("fotos")) {
  const F = CONTENT.fotos;
  cabecalho(F.titulo, F.texto);

  const botao = (id, url) => {
    const a = $(id);
    if (linkOk(url)) { a.href = url; a.target = "_blank"; a.rel = "noopener"; a.hidden = false; }
  };
  botao("btnAlbum", F.albumUrl);
  botao("btnFotografo", F.fotografoUrl);

  // QR Code do álbum (pra imprimir e colocar na festa). A lib vem do CDN; se falhar, só não aparece.
  if (linkOk(F.albumUrl) && window.QRCode) {
    new window.QRCode($("qr"), { text: F.albumUrl, width: 200, height: 200 });
  }
}
