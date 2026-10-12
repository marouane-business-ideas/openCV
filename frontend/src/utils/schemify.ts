const URL_SCHEME_REGEXP = /^((?:f|ht)tps?:)?\/\//;
const DEFAULT_SCHEME = "https";

function Schemify(url: string, protocolScheme?: string) {

    const scheme = protocolScheme ?? DEFAULT_SCHEME;

    if (!URL_SCHEME_REGEXP.test(url)) {
        url = scheme + "://" + url;
    }

    return url;
}

// Links are shown without their scheme: "https://github.com/johndoe" reads "github.com/johndoe"
export const withoutScheme = (url: string) => url.replace(new RegExp(URL_SCHEME_REGEXP, "i"), "");

export default Schemify;