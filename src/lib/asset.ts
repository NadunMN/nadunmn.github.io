/** Resolves a file in /public against the configured Vite base, so paths work on nested routes. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\.?\//, "")}`;
