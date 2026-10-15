import type { Config } from "@react-router/dev/config";

export default {
    appDirectory: "src",
    // No server renders pages: the build writes the HTML files, served as static files
    ssr: false,
    // The home page in each language gets its own HTML file, with its content (for search engines and a faster first
    // display). Other pages share an empty one (__spa-fallback.html) and are rendered in the browser
    prerender: ["/", "/fr"],
} satisfies Config;
