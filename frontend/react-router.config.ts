import type { Config } from "@react-router/dev/config";

export default {
    appDirectory: "src",
    // No server renders pages: the build writes the HTML files, served as static files
    ssr: false,
} satisfies Config;
