export type TransferHistoryResponse = {
    history: Transfer[];
    nextCursor: string | null;
    hasMore: boolean;
};

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
};

export type TransReasonOption = {
    id: string;
    name: string;
};

export type Transfer = {
    id: string;
    all_money: number;
    handling_charge: number;
    trans_money: number;
    trans_finish: boolean;
    trans_schedule_date: Date;
    trans_at: Date;
    createdAt: Date;
    transfer_id: string;
    User?: User;
    TransReasonOption?: TransReasonOption;
};

export type User = {
    id: string;
    uriagekin: number;
    points: number;
    BankAccount?: BankAccount;
};
