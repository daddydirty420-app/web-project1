import { apiFetchNoToken } from "../../../lib/api/client";

export type BankSuggestion = {
    name: string;
    code: string;
    kana: string;
    hira: string;
    normalize: string;
};

export type BranchSuggestion = {
    name: string;
    code: string;
    kana: string;
    hira: string;
};

export type SuggestBanksResponse = {
    banks: BankSuggestion[];
};

export type SuggestBranchesResponse = {
    branches: BranchSuggestion[];
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
