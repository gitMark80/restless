import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { renderSite } from "./scripts/site-pages.mjs";

// Emits the static, crawlable pages (/questions/*, /books, /privacy, 404,
// sitemap.xml) next to the app on every build. See scripts/site-pages.mjs.
function staticPages() {
  return {
    name: "restless-static-pages",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = new URL(req.url, "http://localhost").pathname.replace(/\/$/, "");
        const file = pathname.slice(1) + (pathname.endsWith(".xml") || pathname.endsWith(".html") ? "" : ".html");
        const html = renderSite()[file];
        if (!html) return next();
        res.setHeader("Content-Type", file.endsWith(".xml") ? "application/xml" : "text/html; charset=utf-8");
        res.end(html);
      });
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(renderSite())) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
  };
}

export default defineConfig({
  server: { allowedHosts: ["terminal.local"] },
  plugins: [react(), staticPages()],
});
