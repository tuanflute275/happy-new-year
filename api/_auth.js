// Stateless dashboard session: a signed (HMAC-SHA256) cookie carrying the
// username + expiry. No session table needed — verification is just a
// signature + expiry check against DASHBOARD_SESSION_SECRET.
const crypto = require("crypto");

const COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8h

function getSecret() {
  const secret = process.env.DASHBOARD_SESSION_SECRET;
  if (!secret) throw new Error("Missing DASHBOARD_SESSION_SECRET env var");
  return secret;
}

function sign(payloadB64) {
  return crypto.createHmac("sha256", getSecret()).update(payloadB64).digest("base64url");
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function createSessionCookie(username) {
  const payload = JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL_SECONDS * 1000 });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const token = `${payloadB64}.${sign(payloadB64)}`;
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_SECONDS}`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

function parseCookies(cookieHeader) {
  const out = {};
  (cookieHeader || "").split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    out[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim();
  });
  return out;
}

function verifySession(cookieHeader) {
  const token = parseCookies(cookieHeader)[COOKIE_NAME];
  if (!token) return null;
  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return null;
  const payloadB64 = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);
  if (!safeEqual(sig, sign(payloadB64))) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
  } catch {
    return null;
  }
  if (!payload.exp || payload.exp < Date.now()) return null;
  return { username: payload.u };
}

module.exports = { createSessionCookie, clearSessionCookie, verifySession, safeEqual };
