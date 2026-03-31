export const normalizeJapanese = (str: string) => {
    let s = str
    .normalize("NFKC")
    .toLowerCase();

    s = s.replace(/[\u30A0-\u30FF]/g, (ch) =>
        String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );

    s = s.replace(/\s+/g, "");

    return s;
};