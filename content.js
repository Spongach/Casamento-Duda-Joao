// ============================================================
// CONTEÚDO DO SITE (convidados) — todos os textos ficam aqui.
// Tudo que está entre [COLCHETES] é placeholder pra preencher depois.
// Para links ainda não definidos, deixe "" ou [COLCHETES]: a caixinha/botão aparece sem link.
// ============================================================
export const CONTENT = {
  // "antes" = site de convite | "depois" = pós-casamento (agradecimento, fotos, achados e perdidos)
  fase: "antes",

  noivos: "Maria & João",
  dataISO: "2027-10-10T17:00:00-03:00", // [PLACEHOLDER] data e hora da cerimônia
  dataTexto: "[DATA POR EXTENSO]",
  frase: "[FRASE OU VERSÍCULO DE ABERTURA]",
  textoBoasVindas: "[TEXTO DE BOAS-VINDAS AOS CONVIDADOS]",
  textoAgradecimento: "[TEXTO DE AGRADECIMENTO PÓS-CASAMENTO]",

  local: {
    nome: "[NOME DO LOCAL]",
    endereco: "[ENDEREÇO COMPLETO]",
    foto: "assets/local.jpg", // [PLACEHOLDER] colocar a foto em /assets
    mapsUrl: "[LINK_GOOGLE_MAPS]",
    wazeUrl: "[LINK_WAZE]",
    aviso: "[AVISO SOBRE O PISO — ex: o local é gramado, evite salto fino]",
  },

  // Caixinhas clicáveis da página principal. "fases" controla quando aparecem.
  caixinhas: [
    { icone: "📍", titulo: "Local", texto: "Como chegar", url: "[LINK_GOOGLE_MAPS]", fases: ["antes"] },
    { icone: "✉️", titulo: "Confirmar presença", texto: "Responda até [DATA LIMITE]", url: "rsvp.html", fases: ["antes"] },
    { icone: "🎁", titulo: "Lista de presentes", texto: "Sugestões de presentes", url: "presentes.html", fases: ["antes"] },
    { icone: "👔", titulo: "Traje", texto: "Veja o que vestir", url: "#traje", fases: ["antes"] },
    { icone: "🏙️", titulo: "Guia da cidade", texto: "Onde ficar, comer e passear", url: "guia.html", fases: ["antes"] },
    { icone: "💌", titulo: "Mural de recados", texto: "Deixe uma mensagem pra gente", url: "mural.html", fases: ["antes", "depois"] },
    { icone: "📸", titulo: "Fotos", texto: "Reviva a festa", url: "fotos.html", fases: ["depois"] },
    { icone: "🔎", titulo: "Achados e perdidos", texto: "Esqueceu algo?", url: "achados.html", fases: ["depois"] },
  ],

  traje: {
    titulo: "Traje",
    texto: "[TEXTO SOBRE O TRAJE — ex: esporte fino]",
    evitar: "[CORES A EVITAR — ex: branco, para a noiva]",
    pinterestUrl: "", // [OPCIONAL] link de pasta do Pinterest com inspirações
  },

  historia: {
    titulo: "Nossa história",
    texto: "[TEXTO CURTO E BEM-HUMORADO DE COMO VOCÊS SE CONHECERAM E DO PEDIDO]",
    // Adicione/remova marcos à vontade. foto: "assets/historia-1.jpg" (opcional)
    linhaDoTempo: [
      { data: "[DATA]", titulo: "[Quando nos conhecemos]", texto: "[TEXTO]", foto: "" },
      { data: "[DATA]", titulo: "[Primeiro encontro]", texto: "[TEXTO]", foto: "" },
      { data: "[DATA]", titulo: "[O pedido]", texto: "[TEXTO]", foto: "" },
    ],
  },

  homenagens: {
    titulo: "Homenagens",
    intro: "[TEXTO: pessoas especiais que fazem parte da nossa história]",
    // id vira âncora (homenagens.html#padrinhos). Adicione/remova pessoas à vontade.
    grupos: [
      {
        id: "padrinhos",
        titulo: "Padrinhos e madrinhas",
        pessoas: [
          { nome: "[NOME]", relacao: "[Padrinho do noivo]", foto: "assets/homenagens/padrinho-1.jpg", texto: "[TEXTO CURTO SOBRE A IMPORTÂNCIA DESSA PESSOA]" },
          { nome: "[NOME]", relacao: "[Madrinha da noiva]", foto: "assets/homenagens/madrinha-1.jpg", texto: "[TEXTO CURTO]" },
        ],
      },
      {
        id: "pais-noivo",
        titulo: "Pais do noivo",
        pessoas: [
          { nome: "[NOME]", relacao: "Pai", foto: "assets/homenagens/pai-noivo.jpg", texto: "[TEXTO]" },
          { nome: "[NOME]", relacao: "Mãe", foto: "assets/homenagens/mae-noivo.jpg", texto: "[TEXTO]" },
        ],
      },
      {
        id: "pais-noiva",
        titulo: "Pais da noiva",
        pessoas: [
          { nome: "[NOME]", relacao: "Pai", foto: "assets/homenagens/pai-noiva.jpg", texto: "[TEXTO]" },
          { nome: "[NOME]", relacao: "Mãe", foto: "assets/homenagens/mae-noiva.jpg", texto: "[TEXTO]" },
        ],
      },
      {
        id: "avos",
        titulo: "Avós",
        pessoas: [
          { nome: "[NOME]", relacao: "[Avó/Avô]", foto: "assets/homenagens/avo-1.jpg", texto: "[TEXTO]" },
        ],
      },
    ],
  },

  guia: {
    titulo: "Guia secreto da cidade",
    intro: "[TEXTO: dicas de quem conhece a cidade pra quem vem de fora]",
    categorias: [
      {
        titulo: "Onde ficar",
        itens: [{ nome: "[HOTEL/POUSADA]", descricao: "[DESCRIÇÃO CURTA]", url: "[LINK_GOOGLE_MAPS]" }],
      },
      {
        titulo: "Onde comer",
        itens: [{ nome: "[PIZZARIA FAVORITA]", descricao: "[DESCRIÇÃO CURTA]", url: "[LINK_GOOGLE_MAPS]" }],
      },
      {
        titulo: "Pra passear",
        itens: [{ nome: "[PONTO TURÍSTICO]", descricao: "[DESCRIÇÃO CURTA]", url: "[LINK_GOOGLE_MAPS]" }],
      },
      {
        titulo: "Beleza (pra se arrumar)",
        itens: [{ nome: "[SALÃO OFICIAL]", descricao: "[DESCRIÇÃO CURTA]", url: "[LINK_GOOGLE_MAPS]" }],
      },
    ],
  },

  presentes: {
    titulo: "Lista de presentes",
    textoIntro: "[TEXTO EXPLICANDO POR QUE ESCOLHEMOS ESSES PRESENTES]",
    textoPresencial:
      "[TEXTO: compra presencial também é muito bem-vinda — o link é só um facilitador pra quem preferir comprar online]",
    vazio: "Em breve, a nossa lista vai aparecer aqui. 💛",
  },

  rsvp: {
    titulo: "Confirmar presença",
    texto: "[TEXTO: preencha o formulário até a data limite]",
    dataLimiteISO: "2026-12-15T23:59:59-03:00", // [PLACEHOLDER] depois dessa data o formulário fecha sozinho
    dataLimiteTexto: "[DATA LIMITE POR EXTENSO]",
    maxAcompanhantes: 5,
    msgSucesso: "Presença registrada! Obrigado por celebrar com a gente. 💛",
    msgEncerrado: "As confirmações foram encerradas. Se precisar, fale diretamente com a gente.",
  },

  mural: {
    titulo: "Mural de recados",
    texto: "[TEXTO: deixe uma mensagem de carinho pra gente]",
    msgEnviado: "Recado enviado! Ele aparece no mural depois que a gente aprovar. 💛",
    vazio: "Seja o primeiro a deixar um recado!",
  },

  fotos: {
    titulo: "Fotos",
    texto: "[TEXTO: compartilhe as fotos que você tirou na festa]",
    albumUrl: "", // [PLACEHOLDER] link do álbum compartilhado (Google Fotos/Drive) — vira botão e QR Code
    fotografoUrl: "", // [OPCIONAL] link das fotos oficiais do fotógrafo
  },

  achados: {
    titulo: "Achados e perdidos",
    texto: "[TEXTO: esqueceu algo na festa? Veja se está aqui]",
    contato: "[COMO FALAR COM A GENTE — ex: WhatsApp (00) 00000-0000]",
    vazio: "Nenhum item no momento.",
  },

  rodape: "[TEXTO DO RODAPÉ]",
};
