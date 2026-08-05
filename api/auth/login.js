const { createSessionCookie, safeEqual } = require("../_auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { username, password } = req.body || {};

  // Dev/UAT-only shortcut: password "0" logs in instantly when running
  // locally via `vercel dev` (VERCEL_ENV=development) OR when IS_UAT=true
  // is explicitly set (e.g. on a Vercel Preview deploy for testing).
  // Hard-blocked on VERCEL_ENV=production no matter what, so a stray
  // IS_UAT=true on the wrong environment can never open a prod backdoor.
  const bypassAllowed =
    process.env.VERCEL_ENV !== "production" &&
    (process.env.VERCEL_ENV === "development" || process.env.IS_UAT === "true");
  if (bypassAllowed && password === "0") {
    res.setHeader("Set-Cookie", createSessionCookie(username || "dev"));
    res.status(200).json({ ok: true, dev: true });
    return;
  }

  const expectedUser = process.env.DASHBOARD_USER;
  const expectedPass = process.env.DASHBOARD_PASS;
  if (!expectedUser || !expectedPass) {
    res.status(500).json({ error: "Dashboard auth not configured" });
    return;
  }

  if (!username || !password || !safeEqual(username, expectedUser) || !safeEqual(password, expectedPass)) {
    res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });
    return;
  }

  res.setHeader("Set-Cookie", createSessionCookie(String(username)));
  res.status(200).json({ ok: true });
};
