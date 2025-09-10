export function extractVideoId(url) {
    const match = url.match(/(?:v=|\/embed\/|\.be\/|v=)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}
