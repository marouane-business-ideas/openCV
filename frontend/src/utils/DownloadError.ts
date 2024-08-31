class DownloadError extends Error {
    constructor(message: string, public readonly code: string) {
        super(message);
        this.name = "DownloadError";
    }
}

export default DownloadError;