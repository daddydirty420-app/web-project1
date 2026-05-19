import { apiFetch } from "../../../lib/api/client";

type AccountBody = {
    bankName: string;
    bankCode: string;
    branch: string;
    branchCode: string;
    accountType: string;
    accountNumber: string;
    meigi: string;
};

export const accountEdit = async (accountId: string, body: AccountBody) => {
    return apiFetch(`/bank-account/${accountId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};

export const shopAccountEdit = async (shopId: string, body: AccountBody) => {
    return apiFetch(`/shop-info-edit/${shopId}/bank-account`, {
        method: "POST",
        body: JSON.stringify(body),
    });
};
