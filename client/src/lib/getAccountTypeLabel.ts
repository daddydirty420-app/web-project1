import { ACCOUNT_TYPE_LABEL, AccountType } from "../types/bankSnapshot";

type Params = {
    accountType: AccountType | null;
};

export const getAccountTypeLabel = ({ accountType }: Params) => {
    if (!accountType) return "";

    return ACCOUNT_TYPE_LABEL[accountType];
};
