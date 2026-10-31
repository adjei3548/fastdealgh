import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
const DEFAULTS = { main: true, alternative: true };
function authorized(request) {
  const secret = process.env.CHECKOUT_ADMIN_PASSWORD;
  if (!secret) return false;
  const cookie = request.headers.get("cookie") || "";
  const part = cookie.split(";").map(s => s.trim()).find(s => s.startsWith("fd_admin="));
  if (!part) return false;
  const value = decodeURIComponent(part.slice("fd_admin=".length));
  const last = value.lastIndexOf(".");
  if (last < 1) return false;
  const token = value.slice(0, last), supplied = value.slice(last + 1);
  const expected = crypto.createHmac("sha256", secret).update(token).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}
export default async (request) => {
  if (!authorized(request)) return Response.json({ error: "Unauthorized. Sign in again." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  const store = getStore("fastdealgh-settings");
  if (request.method === "GET") {
    const status = { ...DEFAULTS, ...((await store.get("checkout-status", { type: "json" })) || {}) };
    return Response.json({ status }, { headers: { "Cache-Control": "no-store" } });
  }
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }
  if (!["main", "alternative"].includes(body.provider) || typeof body.active !== "boolean") {
    return Response.json({ error: "Invalid status update." }, { status: 400 });
  }
  const current = { ...DEFAULTS, ...((await store.get("checkout-status", { type: "json" })) || {}) };
  const updated = { ...current, [body.provider]: body.active };
  await store.setJSON("checkout-status", updated);
  return Response.json({ status: updated }, { headers: { "Cache-Control": "no-store" } });
};
