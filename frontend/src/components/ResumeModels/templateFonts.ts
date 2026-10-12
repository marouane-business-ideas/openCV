export interface TemplateFont {
    family: string;
    weight: number;
    style: "normal" | "italic";
    // URL of a woff2 file, as given by a Vite asset import
    url: string;
}

export const fontFaceCss = (fonts: TemplateFont[]) => fonts
    .map(({ family, weight, style, url }) =>
        `@font-face { font-family: "${family}"; font-style: ${style}; font-weight: ${weight}; font-display: block; ` +
        `src: url("${url}") format("woff2"); }`)
    .join("\n");

const dataUrls = new Map<string, Promise<string>>();

const fetchDataUrl = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load the font ${url} (${response.status})`);
    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
};

const getDataUrl = (url: string) => {
    if (!dataUrls.has(url)) {
        dataUrls.set(url, fetchDataUrl(url).catch((error) => {
            dataUrls.delete(url);
            throw error;
        }));
    }
    return dataUrls.get(url) as Promise<string>;
};

/**
 * Puppeteer prints the PDF from about:blank, where the fonts' URLs can't be resolved.
 * Embedding the font files makes the PDF use the exact same fonts as the preview.
 */
export const inlineFonts = async (html: string, fonts: TemplateFont[]) => {
    let inlined = html;
    for (const { url } of fonts) {
        inlined = inlined.split(`url("${url}")`).join(`url("${await getDataUrl(url)}")`);
    }
    return inlined;
};
