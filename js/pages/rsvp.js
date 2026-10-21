import { CONTENT } from "../../content.js";
import { $, el, iniciaPagina, cabecalho } from "../site.js";
import { supabase } from "../supabase.js";

if (iniciaPagina("rsvp")) {
  const R = CONTENT.rsvp;
  cabecalho(R.titulo, R.texto);

  const encerrado = Date.now() > new Date(R.dataLimiteISO).getTime();
  if (encerrado) {
    $("formRsvp").replaceWith(el("p", { className: "destaque texto-centro", textContent: R.msgEncerrado }));
  } else {
    $("texto").textContent = `${R.texto} (até ${R.dataLimiteTexto})`;

    // Acompanhantes
    const sel = $("qtdAcomp");
    for (let i = 0; i <= R.maxAcompanhantes; i++) {
      sel.append(el("option", { value: String(i), textContent: i === 0 ? "Vou sozinho(a)" : `${i} acompanhante${i > 1 ? "s" : ""}` }));
    }
    const desenhaNomes = () => {
      const n = Number(sel.value);
      $("nomesAcomp").replaceChildren(
        ...Array.from({ length: n }, (_, i) =>
          el("input", { className: "nomeAcomp", placeholder: `Nome do acompanhante ${i + 1}`, maxLength: 100, required: true })
        )
      );
    };
    sel.addEventListener("change", desenhaNomes);

    document.querySelectorAll('input[name="vai"]').forEach((r) =>
      r.addEventListener("change", () => { $("blocoAcomp").hidden = r.value !== "sim" || !r.checked; })
    );

    $("formRsvp").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const status = $("rsvpStatus");
      status.textContent = "";
      if ($("rsvpSite").value) return; // isca anti-robô preenchida
      if (!supabase) { status.textContent = "A confirmação ainda não está configurada."; return; }

      const vai = document.querySelector('input[name="vai"]:checked').value === "sim";
      const acompanhantes = vai ? [...document.querySelectorAll(".nomeAcomp")].map((i) => i.value.trim()).filter(Boolean) : [];

      const btn = ev.target.querySelector("button[type=submit]");
      btn.disabled = true;
      const { error } = await supabase.from("rsvps").insert({
        nome: $("rsvpNome").value.trim(),
        vai,
        acompanhantes,
        restricao: $("rsvpRestricao").value.trim() || null,
        recado: $("rsvpRecado").value.trim() || null,
      });
      btn.disabled = false;

      if (error) { status.textContent = "Não foi possível enviar. Tente de novo em instantes."; return; }
      ev.target.reset();
      $("blocoAcomp").hidden = true;
      $("nomesAcomp").replaceChildren();
      status.textContent = R.msgSucesso;
    });
  }
}
