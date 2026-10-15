// React Router's default (@react-router/dev/dist/config/defaults/entry.server.node.tsx), plus the language of the page
// Used by the build to write the HTML of the pages (see react-router.config.ts): there is no server at runtime.
import { PassThrough } from "node:stream";

import type { EntryContext } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";

import i18n from "./i18n";
import { getHomePathLanguage } from "./lib/homePath";

export const streamTimeout = 5_000;

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
) {
    // The home page in the language of its URL, other pages in English like before the browser picks one. The build
    // renders pages one after the other, so changing the language of the shared i18n instance is safe
    await i18n.changeLanguage(getHomePathLanguage(new URL(request.url).pathname) ?? "en");

    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const userAgent = request.headers.get("user-agent");

        // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
        // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
        const readyOption: keyof RenderToPipeableStreamOptions =
            (userAgent && isbot(userAgent)) || routerContext.isSpaMode
                ? "onAllReady"
                : "onShellReady";

        const { pipe, abort } = renderToPipeableStream(
            <ServerRouter context={routerContext} url={request.url} />,
            {
                [readyOption]() {
                    shellRendered = true;
                    const body = new PassThrough();
                    const stream = createReadableStreamFromReadable(body);

                    responseHeaders.set("Content-Type", "text/html");

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        })
                    );

                    pipe(body);
                },
                onShellError(error: unknown) {
                    reject(error);
                },
                onError(error: unknown) {
                    responseStatusCode = 500;
                    // Log streaming rendering errors from inside the shell.  Don't log
                    // errors encountered during initial shell rendering since they'll
                    // reject and get logged in handleDocumentRequest.
                    if (shellRendered) {
                        console.error(error);
                    }
                },
            }
        );

        // Abort the rendering stream after the `streamTimeout` so it has time to
        // flush down the rejected boundaries
        setTimeout(abort, streamTimeout + 1000);
    });
}
