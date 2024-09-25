const fetcher = (url: string, options?: RequestInit) => {
    return fetch(url, {
        ...options
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Something went wrong with the request")
            }
            return res.json();
        });
};

export default fetcher;