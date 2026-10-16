import { defineConfig, type Plugin } from "vite";
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { reactRouter } from "@react-router/dev/vite";

/**
 * `vite preview` serves the build like nginx does in production (see nginx.conf): a file of the build, else the
 * page's own HTML file (pre-rendered pages), else the app without content (__spa-fallback.html). Without it,
 * every page would get the English home page's HTML.
 */
const previewLikeNginx = (): Plugin => ({
  name: "preview-like-nginx",
  configurePreviewServer(server) {
    const clientDirectory = resolve(server.config.root, server.config.build.outDir);
    const isFile = (path: string) => existsSync(path) && statSync(path).isFile();
    // Like nginx's /api/ location: these go to the backend (preview.proxy, the dev server's proxy by default)
    const proxiedPaths = Object.keys(server.config.preview.proxy ?? {});

    server.middlewares.use((req, res, next) => {
      const { pathname, search } = new URL(req.url ?? "/", "http://localhost");
      if (proxiedPaths.some((path) => pathname.startsWith(path)) || isFile(join(clientDirectory, pathname))) {
        next();
        return;
      }
      if (pathname.startsWith("/assets/")) {
        res.statusCode = 404;
        res.end();
        return;
      }
      const pageFile = join(pathname, "index.html");
      req.url = (isFile(join(clientDirectory, pageFile)) ? pageFile : "/__spa-fallback.html") + search;
      next();
    });
  },
});

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

    // Chrome can go away while the dev server keeps running (e.g. when the computer sleeps): print again with a
    // new one rather than failing until the dev server restarts
    const render = async (html: string) => {
      const current = getRenderer();
      try {
        return await (await current).render(html);
      } catch {
        if (renderer === current) renderer = undefined;
        current.then((pdfRenderer) => pdfRenderer.close()).catch(() => {});
        return (await getRenderer()).render(html);
      }
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
          const pdf = await render(html);
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

// React Router's plugin adds hot reloading to every React file, which needs this script to run first. React Router
// adds it to the app's pages only. If a React Router upgrade renames it, the template lab fails with "React Router
// Vite plugin can't detect preamble"
const REACT_ROUTER_HMR_PREAMBLE = "/@id/__x00__virtual:react-router/inject-hmr-runtime";

/**
 * Dev-only: serves the template lab's page. React Router's dev server answers every other URL with the app.
 */
const templateLabPage = (): Plugin => ({
  name: "template-lab-page",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (new URL(req.url ?? "/", "http://localhost").pathname !== "/template-lab.html") {
        next();
        return;
      }
      try {
        const html = (await readFile(new URL("./template-lab.html", import.meta.url), "utf8"))
          .replace("<head>", `<head>\n    <script type="module" src="${REACT_ROUTER_HMR_PREAMBLE}"></script>`);
        res.setHeader("Content-Type", "text/html");
        res.end(await server.transformIndexHtml(req.url ?? "/", html));
      } catch (error) {
        next(error);
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRouter(), templateLabPage(), templateLabPdf(), previewLikeNginx()],
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
