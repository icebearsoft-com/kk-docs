import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";

const htmlDir = path.resolve("public");                 // donde viven tus .html
const outFile = path.resolve("public/search-index.json");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function cleanText(s) {
  return (s || "").replace(/\s+/g, " ").trim();
}

/**
 * Limpieza final defensiva.
 * (igual quitamos el bloque que lo contiene, pero esto remata)
 */
function stripBoilerplate(text) {
  let t = text || "";
  t = t.replace(/\bLast updated on\b.*?(?=\.|\n|$)/gi, " ");
  t = t.replace(/\bLast updated\b.*?(?=\.|\n|$)/gi, " ");
  t = t.replace(/\bUpdated on\b.*?(?=\.|\n|$)/gi, " ");
  return cleanText(t);
}

const files = walk(htmlDir).filter((f) => f.endsWith(".html"));

const index = [];

for (const file of files) {
  const rel = path.relative(htmlDir, file).replaceAll("\\", "/");
  const url = "/" + rel; // conserva .html

  const html = fs.readFileSync(file, "utf8");
  const $ = load(html);

  // Quita lo que jamás debe indexarse
  $("script, style").remove();
  $("nav, footer, aside").remove();

  // Quita tu sección de “Next steps”
  $("section.section-recent").remove();

  // Sidebar (se llena por JS)
  $(".sidebar-component-wrapper, .sidebar-component, #sidebar-menu").remove();

  // === Contenido real (tu estructura) ===
  const hero = $("header.section-guideline-header").clone();
  const article = $("header.section-guideline-content").clone();

  // HERO: quita la tarjeta que trae "Last updated..." y texto duplicado
  hero.find(".guideline-header-card-wrapper").remove();
  hero.find(".guideline-card, .guideline-card-updated-wrapper, .card-updated-wrapper").remove();

  // ARTICLE: por si acaso, quita cualquier “updated”
  article.find(".guideline-card-updated-wrapper, .card-updated-wrapper").remove();

  const heroText = stripBoilerplate(cleanText(hero.text()));
  const articleText = stripBoilerplate(cleanText(article.text()));

  // Title: preferimos el h1 del artículo
  const title =
    cleanText(article.find("h1").first().text()) ||
    cleanText(hero.find("h1").first().text()) ||
    cleanText($("title").first().text()) ||
    path.basename(rel, ".html");

  // Headings: del artículo (más semántico)
  const headings = article
    .find("h1,h2,h3")
    .map((_, el) => cleanText($(el).text()))
    .get()
    .filter(Boolean)
    .slice(0, 60);

  // content: lo usamos para buscar (hero + article)
  const content = stripBoilerplate(cleanText(`${heroText}\n${articleText}`));

  // articleContent: SOLO artículo (para snippet limpio)
  const articleContent = articleText;

  index.push({ title, headings, content, articleContent, url });
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(index), "utf8");
console.log(`✅ search-index generado: ${index.length} páginas -> ${outFile}`);