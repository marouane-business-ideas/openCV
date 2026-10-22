// The app is free for everyone, with tips: no PDF limit, and nothing sells Premium. false brings back the free plan
// (5 PDFs) and Premium. Switched together with the backend's FREE_FOR_EVERYONE: see ARCHITECTURE.md
export const FREE_FOR_EVERYONE = import.meta.env.VITE_FREE_FOR_EVERYONE === "true";
