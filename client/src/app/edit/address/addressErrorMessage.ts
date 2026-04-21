import toast from "react-hot-toast";

export const showAddressErrorToast = (code: string) => {
    const messages: Record<string, string> = {
        INVALID_OUERY: "空の項目があります",
        INVALID_POST_NUMBER: "不正な郵便番号です",
        ADDRESS_NOT_FOUND: "住所が見つかりません",
        TODOUHUKEN_NOT_FOUND: "都道府県が見つかりません",
        INVALID_TODOUHUKEN: "不正な都道府県です",
        NOT_SAME_POSTNUMBER_TODOUHUKEN: "郵便番号と都道府県が一致しません",
        NOT_SAME_POSTNUMBER_SHIKUTYOUSON: "郵便番号と市区町村が一致しません",
    };

    toast.error(messages[code] ?? "住所の更新に失敗しました");
};