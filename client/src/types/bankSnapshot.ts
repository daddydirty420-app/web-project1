export type AccountType = "普通預金" | "当座預金" | "定期預金" | "その他";

export type BankSnapshot = {
    bank_name: string;
    branch_name: string;
    account_type: AccountType;
    account_number: string;
    meigi: string;
};
