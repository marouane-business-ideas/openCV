const URL_SCHEME_REGEXP = /^((?:f|ht)tps?:)?\/\//;
const DEFAULT_SCHEME = "https";

function Schemify(url: string, protocolScheme?: string) {

    const scheme = protocolScheme ?? DEFAULT_SCHEME;

    if (!URL_SCHEME_REGEXP.test(url)) {
        url = scheme + "://" + url;
    }

    return url;
}

export default Schemify;