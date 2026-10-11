import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

interface PdfRenderer {
  render: (html: string) => Promise<Uint8Array>;
  close: () => Promise<void>;
}

const LOOPBACK_ADDRESSES = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];

/**
 * Dev-only endpoint used by the template lab (template-lab.html) and the template tests.
 * It prints HTML to PDF with the backend's own renderer, i.e. exactly like the download endpoint.
 */
const templateLabPdf = (): Plugin => ({
  name: "template-lab-pdf",
  apply: "serve",
  configureServer(server) {
    let renderer: Promise<PdfRenderer> | undefined;

    const getRenderer = () => {
      // Imported from its own location at runtime (not bundled with this config) so that it finds
      // Puppeteer in the backend's node_modules
      const rendererUrl = new URL("../backend/src/pdf/renderPdf.js", import.meta.url).href;
      renderer ??= import(/* @vite-ignore */ rendererUrl)
        .then(({ launchPdfRenderer }) => launchPdfRenderer())
        .catch((error) => {
          renderer = undefined;
          throw error;
        });
      return renderer;
    };

    server.middlewares.use("/__template-lab/pdf", (req, res) => {
      // The dev server listens on 0.0.0.0: other machines must not be able to make this one's Chrome render HTML
      if (req.method !== "POST" || !LOOPBACK_ADDRESSES.includes(req.socket.remoteAddress ?? "")) {
        res.statusCode = 403;
        res.end();
        return;
      }

      let html = "";
      req.setEncoding("utf8");
      req.on("data", (chunk: string) => { html += chunk; });
      req.on("end", async () => {
        try {
          const pdf = await (await getRenderer()).render(html);
          res.setHeader("Content-Type", "application/pdf");
          res.end(pdf);
        } catch (error) {
          res.statusCode = 500;
          res.end(String(error));
        }
      });
    });

    server.httpServer?.once("close", () => {
      renderer?.then((pdfRenderer) => pdfRenderer.close()).catch(() => {});
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), templateLabPdf()],
  server: {
    host: "0.0.0.0",
    allowedHosts: ["onlineresume.dev", "www.onlineresume.dev"],
    proxy: {
      "/api": {
        target: "http://localhost:1337",
        changeOrigin: true,
      },
    },
  },
});
