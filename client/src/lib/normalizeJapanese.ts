const toHiragana = (str: string) => {
    return str.replace(/[\u30a1-\u30f6]/g, (ch) =>
        String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
};

const removeDakuten = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const normalizeSmallKana = (str: string) => {
    return str
    .replace(/ゃ/g, "や")
    .replace(/ゅ/g, "ゆ")
    .replace(/ょ/g, "よ")
    .replace(/っ/g, "つ");
};

const absorbChoon = (str: string) => {
    return str.replace(/ー/g, "");
};

const toLower = (str: string) => str.toLowerCase();

export const normalizeJapanese = (str: string) => {
    let s = str;

    s = toLower(s);
    s = toHiragana(s);
    s = removeDakuten(s);
    s = normalizeSmallKana(s);
    s = absorbChoon(s);

    return s;
};