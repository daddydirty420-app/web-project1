export type AccountTypeOption = {
    id: string;
    name: string;
};

export type BankAccount = {
    id: string;
    bank_name: string;
    bank_code: string;
    branch: string;
    branch_code: string;
    account_type_id: number;
    account_number: string;
    meigi: string;
    AccountTypeOption: AccountTypeOption;
};