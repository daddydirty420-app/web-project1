export const normalizeJapanese = (str: string) => {
    let s = str.toLowerCase();

    s = s
        .replace(/[\u30A0-\u30FF]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
        .replace(/ヵ/g, 'か')
        .replace(/ヶ/g, 'け');

    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    s = s.replace(/ゃ/g, 'や').replace(/ゅ/g, 'ゆ').replace(/ょ/g, 'よ').replace(/っ/g, 'つ');

    s = s.replace(/ー/g, '');

    return s;
};
