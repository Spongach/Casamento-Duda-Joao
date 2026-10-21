import { CONFIG } from "../config.js";

export const supabaseConfigurado = !CONFIG.SUPABASE_URL.startsWith("COLE_");

// Só carrega a biblioteca se o Supabase estiver configurado (o site funciona sem ele, só sem as partes dinâmicas).
export let supabase = null;
if (supabaseConfigurado) {
  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.45.4");
    supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  } catch (e) {
    console.error("Não foi possível carregar o Supabase:", e);
  }
}
