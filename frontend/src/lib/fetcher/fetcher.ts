class FetchError extends Error {
    info: unknown;
    status: number;

    constructor(message: string, info: unknown, status: number) {
        super(message);
        this.info = info;
        this.status = status;
    }
}

const fetcher = (url: string, options?: RequestInit) => {
    return fetch(url, {
        ...options
    })
        .then(async res => {
            if (!res.ok) {
                const info = await res.json();
                const error = new FetchError("An error occurred while fetching the data.", info, res.status);
                throw error;
            }

            return res.json();
        });
};

export default fetcher;