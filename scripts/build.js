// Build script: copies the static site into dist/, minifying CSS and
// obfuscating the author's own JS. Third-party/vendor canvas engines
// (fireworks.js, scriptWatch.js, assets/js/vendor/*) are copied as-is —
// they're adapted from external demos and obfuscating them risks breaking
// timing-sensitive animation code for no real benefit.
const fs = require("fs");
const path = require("path");
const JavaScriptObfuscator = require("javascript-obfuscator");
const CleanCSS = require("clean-css");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const SKIP_TOP_LEVEL = new Set([
  ".git",
  ".vscode",
  ".gitignore",
  "node_modules",
  "dist",
  "scripts",
  "package.json",
  "package-lock.json",
  "README.md",
  "TODO.md",
  // Serverless functions live at the project root — Vercel resolves /api
  // independently of `outputDirectory`, so it must NOT be duplicated into dist/.
  "api",
  ".env",
  ".env.local",
  ".env.example",
]);

// Author-written JS files (relative to assets/js/) to obfuscate.
// Everything else under assets/js (fireworks.js, scriptWatch.js, vendor/) is left untouched.
const OBFUSCATE_JS = new Set([
  "celebrate.js",
  "count_down.js",
  "custom.js",
  "personalize.js",
  "script.js",
  "self.js",
  "share.js",
  "snowflake.js",
  "xin-xam.js",
]);

const OBFUSCATOR_OPTIONS = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  identifierNamesGenerator: "hexadecimal",
  renameGlobals: false,
  stringArray: true,
  stringArrayEncoding: ["base64"],
  stringArrayThreshold: 0.75,
  simplify: true,
};

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function walk(dir, cb) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

function obfuscateJs(code) {
  return JavaScriptObfuscator.obfuscate(code, OBFUSCATOR_OPTIONS).getObfuscatedCode();
}

function minifyCss(code) {
  const result = new CleanCSS({}).minify(code);
  if (result.errors.length) {
    throw new Error(`CSS minify failed: ${result.errors.join("\n")}`);
  }
  return result.styles;
}

// Recompress an image in place. Only keeps the result if it's actually
// smaller — some already-optimized images (e.g. bg.jpg) can grow slightly
// when re-encoded, so this is a safe no-op for those.
async function optimizeImage(file) {
  const original = fs.readFileSync(file);
  const meta = await sharp(original).metadata();
  let optimized;
  if (meta.format === "png") {
    optimized = await sharp(original).png({ compressionLevel: 9, palette: true }).toBuffer();
  } else if (meta.format === "jpeg") {
    optimized = await sharp(original).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  } else {
    return { changed: false };
  }
  if (optimized.length < original.length) {
    fs.writeFileSync(file, optimized);
    return { changed: true, before: original.length, after: optimized.length };
  }
  return { changed: false };
}

// Obfuscate inline <script> blocks (no src attribute) in a page's HTML.
function obfuscateInlineScripts(html) {
  return html.replace(
    /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi,
    (whole, attrs, body) => {
      if (/type\s*=\s*["'](?!text\/javascript)[^"']*["']/i.test(attrs)) {
        return whole; // non-JS script blocks (e.g. ld+json) — leave alone
      }
      const trimmed = body.trim();
      if (!trimmed) return whole;
      return `<script${attrs}>${obfuscateJs(trimmed)}</script>`;
    }
  );
}

async function main() {
  console.log("Building dist/ ...");
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  for (const entry of fs.readdirSync(ROOT)) {
    if (SKIP_TOP_LEVEL.has(entry)) continue;
    copyRecursive(path.join(ROOT, entry), path.join(DIST, entry));
  }

  let cssCount = 0;
  walk(path.join(DIST, "assets", "css"), (file) => {
    if (file.endsWith(".css")) {
      fs.writeFileSync(file, minifyCss(fs.readFileSync(file, "utf8")));
      cssCount++;
    }
  });

  let jsCount = 0;
  walk(path.join(DIST, "assets", "js"), (file) => {
    const rel = path.relative(path.join(DIST, "assets", "js"), file).replace(/\\/g, "/");
    if (file.endsWith(".js") && OBFUSCATE_JS.has(rel)) {
      fs.writeFileSync(file, obfuscateJs(fs.readFileSync(file, "utf8")));
      jsCount++;
    }
  });

  let htmlCount = 0;
  for (const htmlFile of ["index.html", "firework.html"]) {
    const full = path.join(DIST, htmlFile);
    if (fs.existsSync(full)) {
      fs.writeFileSync(full, obfuscateInlineScripts(fs.readFileSync(full, "utf8")));
      htmlCount++;
    }
  }

  let imgChanged = 0;
  let imgBefore = 0;
  let imgAfter = 0;
  const imageFiles = [];
  walk(path.join(DIST, "assets", "img"), (file) => {
    if (/\.(png|jpe?g)$/i.test(file)) imageFiles.push(file);
  });
  for (const file of imageFiles) {
    const result = await optimizeImage(file);
    if (result.changed) {
      imgChanged++;
      imgBefore += result.before;
      imgAfter += result.after;
    }
  }

  console.log(`Done: ${cssCount} CSS file(s) minified, ${jsCount} JS file(s) obfuscated, ${htmlCount} HTML file(s) had inline scripts obfuscated.`);
  console.log(
    `Images: ${imgChanged}/${imageFiles.length} file(s) recompressed` +
      (imgChanged ? ` (${(imgBefore / 1024).toFixed(0)}KB -> ${(imgAfter / 1024).toFixed(0)}KB).` : ".")
  );
  console.log("Output -> dist/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
