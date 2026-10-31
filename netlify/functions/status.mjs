import { getStore } from "@netlify/blobs";
const DEFAULTS = { main: true, alternative: true };
export default async () => {
  try {
    const store = getStore("fastdealgh-settings");
    const saved = await store.get("checkout-status", { type: "json" });
    return Response.json({ status: { ...DEFAULTS, ...(saved || {}) } }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ status: DEFAULTS, warning: "Persistent storage is not configured or unavailable." }, { headers: { "Cache-Control": "no-store" } });
  }
};
