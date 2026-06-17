export const ACCOUNT_TYPES = ["ordinary", "checking", "savings"] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

export type BankSnapshot = {
    bank_name: string;
    branch_name: string;
    account_type: AccountType;
    account_number: string;
    meigi: string;
};
