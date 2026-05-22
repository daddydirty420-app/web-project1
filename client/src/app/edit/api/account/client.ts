import { apiFetch, apiFetchNoToken } from "../../../../lib/api/client";

type AccountBody = {
    bankName: string;
    bankCode: string;
    branch: string;
    branchCode: string;
    accountType: string;
    accountNumber: string;
    meigi: string;
};

type BankSuggestion = {
    name: string;
    code: string;
    kana: string;
    hira: string;
    normalize: string;
};

type BranchSuggestion = {
    name: string;
    code: string;
    kana: string;
    hira: string;
};

type SuggestBanksResponse = {
    banks: BankSuggestion[];
};

type SuggestBranchesResponse = {
    branches: BranchSuggestion[];
};

export const fetchAccountEdit = async (accountId: string, body: AccountBody) => {
    return apiFetch(`/bank-account/${accountId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};

export const fetchShopAccountEdit = async (shopId: string, body: AccountBody) => {
    return apiFetch(`/shop-info-edit/${shopId}/bank-account`, {
        method: "POST",
        body: JSON.stringify(body),
    });
};

export const fetchSuggestBanks = async (bankQuery: string): Promise<SuggestBanksResponse> => {
    return apiFetchNoToken(`/banks/search?keyword=${bankQuery}`, {
        method: "GET",
    });
};

export const fetchSuggestBranches = async (branchQuery: string, bankCode: string): Promise<SuggestBranchesResponse> => {
    return apiFetchNoToken(`/branches/search?keyword=${branchQuery}&bankCode=${bankCode}`, {
        method: "GET",
    });
};
