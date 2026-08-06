export function generateNgrams(text: string): string[] {
    if (!text) return [];

    const normalized = text
        .trim()
        .replace(/[\u3000・\-、,/._()[\]{}]+/g, " ")
        .replace(/\s+/g, " ");

    const words = normalized.split(" ");

    const result: string[] = [];

    for (let i = 0; i < words.length; i++) {
        for (let j = i; j < words.length; j++) {
            result.push(words.slice(i, j + 1).join(" "));
        }
    }

    return result;
}
