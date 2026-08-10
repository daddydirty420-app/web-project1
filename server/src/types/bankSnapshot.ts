export const ACCOUNT_TYPES = ["ordinary", "checking", "savings"] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

export type BankSnapshot = {
    bank_name: string;
    branch_name: string;
    account_type: AccountType | "";
    account_number: string;
    meigi: string;
};

export const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
    ordinary: "普通預金",
    checking: "当座預金",
    savings: "貯蓄預金",
};
