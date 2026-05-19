import toast from "react-hot-toast";

export const showHonninErrorToast = (code: string) => {
    const messages: Record<string, string> = {
        INVALID_BODY: "未入力項目があります",
        TODOUHUKEN_NOT_FOUND: "都道府県が見つかりません",
        INVALID_TODOUHUKEN: "不正な都道府県です",
    };

    toast.error(messages[code] ?? "本人確認情報の送信に失敗しました");
};
