const toHiragana = (str: string) =>
    str.replace(/[\u30A0-\u30FF]/g, (ch) =>
        String.fromCharCode(ch.charCodeAt(0) - 0x60)
    )
    .replace(/ヵ/g, "か")
    .replace(/ヶ/g, "け");

const removeDakuten = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const normalizeSmallKana = (str: string) =>
    str
    .replace(/ゃ/g, "や")
    .replace(/ゅ/g, "ゆ")
    .replace(/ょ/g, "よ")
    .replace(/っ/g, "つ");

const absorbChoon = (str: string) => str.replace(/ー/g, "");

export const normalizeJapanese = (str: string) => {
    let s = str;

    s = s.toLowerCase();
    s = toHiragana(s);
    s = removeDakuten(s);
    s = normalizeSmallKana(s);
    s = absorbChoon(s);

    return s;
};