import { createReadStream, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

const root = path.resolve(import.meta.dirname, "../..");
const legacyPrefix = "/legado/";
const legacyFiles = [
  "Pomin360 · Universo de soluções.html",
  "calculadora.html",
  "favicon.svg",
  "Pomin360 · Universo de soluções_files/style.css",
  "Pomin360 · Universo de soluções_files/academy.css",
  "Pomin360 · Universo de soluções_files/app.js"
];

const contentType = (file: string) => file.endsWith(".html") ? "text/html; charset=utf-8"
  : file.endsWith(".css") ? "text/css; charset=utf-8"
  : file.endsWith(".js") ? "text/javascript; charset=utf-8"
  : file.endsWith(".svg") ? "image/svg+xml"
  : "application/octet-stream";

function legacy(): Plugin {
  return {
    name: "pomin360-legacy",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = decodeURIComponent(request.url?.split("?")[0] ?? "");
        if (!pathname.startsWith(legacyPrefix)) return next();
        const relative = pathname.slice(legacyPrefix.length).normalize("NFC");
        if (!legacyFiles.includes(relative)) return next();
        const source = path.join(root, relative);
        if (!existsSync(source)) return next();
        response.setHeader("Content-Type", contentType(source));
        createReadStream(source).pipe(response);
      });
    },
    generateBundle() {
      for (const file of legacyFiles) {
        const source = readFileSync(path.join(root, file));
        this.emitFile({ type: "asset", fileName: `legado/${file}`, source });
        const decomposed = file.normalize("NFD");
        if (file.includes("_files/") && decomposed !== file) this.emitFile({ type: "asset", fileName: `legado/${decomposed}`, source });
      }
    }
  };
}

export default defineConfig({
  envDir: root,
  plugins: [legacy()],
  // Páginas: a apresentação oficial (v3) em /, com a página de cada aplicação (/v3/produto/) e o guia (/v3/guia/);
  // as versões anteriores ficam em /v1/ e /apresentacao/ (v2). /v3/ só redireciona para /.
  build: { rolldownOptions: { input: { main: path.resolve(import.meta.dirname, "index.html"), v1: path.resolve(import.meta.dirname, "v1/index.html"), apresentacao: path.resolve(import.meta.dirname, "apresentacao/index.html"), v3: path.resolve(import.meta.dirname, "v3/index.html"), v3produto: path.resolve(import.meta.dirname, "v3/produto/index.html"), v3guia: path.resolve(import.meta.dirname, "v3/guia/index.html") } } },
  // IA e Contratar ainda moram no servir.py (porta 5360, com login); o resto da API é o Next (3000)
  server: { proxy: { "/api/perguntar": "http://127.0.0.1:5360", "/api/contratar": "http://127.0.0.1:5360", "/api": "http://127.0.0.1:3000" } }
});
