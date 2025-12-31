import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, "public");

app.use(express.json());

// ✅ 1) Cache estático (ajustable)
app.use((req, res, next) => {
  if (req.url.startsWith("/img/") || req.url.startsWith("/css/") || req.url.startsWith("/js/")) {
    res.setHeader("Cache-Control", "public, max-age=86400"); // 1 día
  }
  next();
});

// ✅ 2) Tu sitio tal cual
app.use(express.static(PUBLIC_DIR, { extensions: ["html"] }));

// ✅ 3) API para extras (aquí vas agregando lo que necesites)
app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// ✅ 4) Fallback inteligente:
// - si es ruta de API -> 404 JSON
// - si es ruta web -> sirve index.html (útil si tienes SPA)
// - si NO es SPA, lo puedes cambiar para servir 404.html
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ ok: false, error: "Not Found" });
  }

  // Si tu doc es multi-page, puedes comentar esta línea y crear 404.html
  return res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Docs running on http://localhost:${PORT}`));
