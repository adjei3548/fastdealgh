import { getStore } from "@netlify/blobs";
const DESTINATIONS = {
  main: "https://mystore.dakazinabusinessconsult.com/store/fastdealgh-data-bundles-emmanuel-adjei-8-enterprise",
  alternative: "https://dealsgh.store/fastdealgh"
};
const LABELS = { main: "Main Checkout", alternative: "Alternative Checkout" };
const DEFAULTS = { main: true, alternative: true };
const escapeHtml = s => s.replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
function page(title, message, script = "") {
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>FASTDEALGH Checkout</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#101010;color:#f7f7f7;font:16px system-ui;padding:22px;box-sizing:border-box}.box{max-width:460px;padding:30px;border:1px solid #3a3a3a;border-radius:18px;background:#191919}h1{font-size:24px}.gold{color:#ffc107}.muted{color:#aaa;line-height:1.7}</style></head><body><main class="box"><h1><span class="gold">FASTDEALGH</span></h1><h2>${escapeHtml(title)}</h2><p class="muted">${escapeHtml(message)}</p><p class="muted">If you are not redirected, return to the FASTDEALGH website and choose an available option.</p></main>${script}</body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
export default async (request) => {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider")?.toLowerCase();
  if (!Object.hasOwn(DESTINATIONS, provider)) return new Response("Not found", { status: 404 });
  let status;
  try {
    const store = getStore("fastdealgh-settings");
    status = { ...DEFAULTS, ...((await store.get("checkout-status", { type: "json" })) || {}) };
  } catch {
    return page("Checkout status unavailable", "We could not confirm checkout availability right now. Please return and try again.", "");
  }
  if (status[provider]) return new Response(null, { status: 302, headers: { Location: DESTINATIONS[provider], "Cache-Control": "no-store" } });
  const other = provider === "main" ? "alternative" : "main";
  if (!status[other]) return page("Ordering temporarily unavailable", "FASTDEALGH is temporarily unavailable. Ordering is temporarily unavailable. Please check back shortly.");
  const script = `<script>setTimeout(()=>location.replace('/checkout/${other}'),1600)</script>`;
  return page(`${LABELS[provider]} temporarily unavailable`, `The ${LABELS[provider]} is temporarily unavailable. You will be redirected to the ${LABELS[other]}.`, script);
};
