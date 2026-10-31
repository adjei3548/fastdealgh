import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
const DEFAULTS = { main: true, alternative: true };
const cookieName = "fd_admin";
function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}
export default async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const password = process.env.CHECKOUT_ADMIN_PASSWORD;
  if (!password) return Response.json({ error: "Admin is not configured. Set CHECKOUT_ADMIN_PASSWORD in Netlify environment variables, then redeploy." }, { status: 503 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof body.password !== "string" || !crypto.timingSafeEqual(Buffer.from(crypto.createHash("sha256").update(body.password).digest()), Buffer.from(crypto.createHash("sha256").update(password).digest()))) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }
  let status = DEFAULTS;
  try { const store = getStore("fastdealgh-settings"); status = { ...DEFAULTS, ...((await store.get("checkout-status", { type: "json" })) || {}) }; }
  catch { return Response.json({ error: "Persistent storage is unavailable. Check Netlify Blobs configuration." }, { status: 503 }); }
  const token = `${Date.now()}.${crypto.randomBytes(18).toString("hex")}`;
  const cookieValue = `${token}.${sign(token, password)}`;
  return Response.json({ status }, { headers: {
    "Set-Cookie": `${cookieName}=${cookieValue}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`,
    "Cache-Control": "no-store"
  }});
};
