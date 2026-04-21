import toast from "react-hot-toast";

export const showBankErrorToast = (code: string) => {
    const messages: Record<string, string> = {
        INVALID_BANK: "銀行が見つかりません",
        INVALID_BRANCH: "支店名が見つかりません",
        INVALID_ACCOUNT_TYPE: "不正な口座種別です",
        INVALID_QUERY: "空の項目があります",
    };

    toast.error(messages[code] ?? "口座情報の更新に失敗しました");
};