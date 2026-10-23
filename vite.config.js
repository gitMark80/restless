import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { renderSite } from "./scripts/site-pages.mjs";

// Emits the static, crawlable pages (/questions/*, /books, /privacy, 404,
// sitemap.xml) next to the app on every build. See scripts/site-pages.mjs.
function staticPages() {
  return {
    name: "restless-static-pages",
    apply: "build",
    generateBundle() {
      for (const [fileName, source] of Object.entries(renderSite())) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), staticPages()],
});
