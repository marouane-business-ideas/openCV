import notoSerif400 from "@fontsource/noto-serif/files/noto-serif-latin-400-normal.woff2";
import sourceSans400 from "@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff2";
import sourceSans400Italic from "@fontsource/source-sans-3/files/source-sans-3-latin-400-italic.woff2";
import sourceSans700 from "@fontsource/source-sans-3/files/source-sans-3-latin-700-normal.woff2";
import sourceSans700Italic from "@fontsource/source-sans-3/files/source-sans-3-latin-700-italic.woff2";
import archivoNarrow400 from "@fontsource/archivo-narrow/files/archivo-narrow-latin-400-normal.woff2";

import { TemplateFont } from "./templateFonts";

// Latin subsets only: they cover English and French, and keep the HTML sent for PDF generation small
export const modernTemplateFonts: TemplateFont[] = [
    { family: "Noto Serif", weight: 400, style: "normal", url: notoSerif400 },
    { family: "Source Sans 3", weight: 400, style: "normal", url: sourceSans400 },
    { family: "Source Sans 3", weight: 400, style: "italic", url: sourceSans400Italic },
    { family: "Source Sans 3", weight: 700, style: "normal", url: sourceSans700 },
    { family: "Source Sans 3", weight: 700, style: "italic", url: sourceSans700Italic },
    { family: "Archivo Narrow", weight: 400, style: "normal", url: archivoNarrow400 },
];
