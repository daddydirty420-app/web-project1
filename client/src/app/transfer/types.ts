export type AccountTypeOption = {
    id: string;
    name: string;
};

export type BankAccount = {
    id: string;
    bank_name: string;
    branch: string;
    account_type_id: number;
    account_number: string;
    meigi: string;
    AccountTypeOption?: AccountTypeOption;
}

export type User = {
    id: string;
    uriagekin: number;
    points: number;
    BankAccount?: BankAccount;
};