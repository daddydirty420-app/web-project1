import toast from "react-hot-toast";

export const showStep2ErrorToast = (code: string) => {
    const messages: Record<string, string> = {
        INVALID_BANK: "銀行が見つかりません",
        INVALID_BRANCH: "支店名が見つかりません",
        INVALID_ACCOUNT_TYPE: "不正な口座種別です",
    };

    toast.error(messages[code] ?? "口座情報の登録に失敗しました");
};
