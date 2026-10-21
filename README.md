# Site do nosso casamento

HTML/CSS/JS puro, sem build. Publicação via GitHub Pages. Backend (login + dados) no Supabase.

## Estrutura

```
index.html          Casamento (capa, contador, local, caixinhas, traje)
historia.html       Nossa história (linha do tempo)
homenagens.html     Padrinhos, pais, avós
guia.html           Guia da cidade
presentes.html      Lista de presentes (vem do painel admin)
mural.html          Mural de recados (com aprovação)
rsvp.html           Confirmação de presença (fecha sozinha na data limite)
fotos.html          Pós-festa: álbum + QR Code
achados.html        Pós-festa: achados e perdidos
admin/index.html    Painel dos noivos (login)

content.js          TODOS os textos (placeholders [ASSIM]) + fase "antes"/"depois"
config.js           chaves do Supabase e link da planilha
css/style.css       visual (cores no :root)
css/admin.css       visual do painel
js/site.js          menu, rodapé e helpers compartilhados
js/pages/*.js       lógica de cada página
js/admin.js         lógica do painel
js/supabase.js      cliente Supabase
supabase/schema.sql tabelas + segurança (RLS)
assets/             fotos (local.jpg, homenagens/...)
```

## Testar local (sem Supabase)

Módulos ES não funcionam abrindo o arquivo direto. Dentro da pasta:

```
python3 -m http.server 8000
```

Abra http://localhost:8000. Sem o Supabase configurado, o site funciona normalmente;
só presentes, mural e achados aparecem vazios e o RSVP avisa que não está configurado.

## Setup do Supabase (uma vez)

1. Criar projeto em supabase.com.
2. SQL Editor: colar `supabase/schema.sql` (trocando os dois e-mails) e rodar.
3. Authentication > Users: criar os 2 usuários (mesmos e-mails, com senha).
   Em Authentication > Providers > Email, desativar "Allow new users to sign up".
4. Project Settings > API: copiar URL e anon key para `config.js`.
5. Colocar o link da planilha em `PLANILHA_URL` (`config.js`).
6. Testar: http://localhost:8000/admin/

## Fluxos

- Presentes: cadastra no admin (rascunho) → "Publicar" → aparece em presentes.html.
- RSVP: convidado preenche em rsvp.html → admin > Confirmações (contagem + exportar CSV).
- Recados: convidado envia → admin > Recados > Aprovar → aparece no mural.
- Pós-casamento: em `content.js` troque `fase: "antes"` por `fase: "depois"`.
  Sai contador/RSVP/presentes/guia; entram agradecimento, fotos e achados e perdidos.

## Segurança

- A proteção real é a RLS do Supabase (`schema.sql`), não esconder a página /admin/.
- Convidados só conseguem: enviar RSVP, enviar recado (pendente), ler o que foi publicado.
- A anon key no front é pública por design.
