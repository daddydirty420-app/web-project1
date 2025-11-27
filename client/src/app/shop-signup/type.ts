export type ComOrFreeOption = {
    id: number;
    name: string;
};

export type TodouhukenOption = {
    id: number;
    name: string;
};

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

export type Address = {
    id: string;
    post_number: string;
    shikutyouson: string;
    banchi: string;
    building: string;
    AddressTodouhuken?: TodouhukenOption;
};

export type Name = {
    id: string;
    sei: string;
    mei: string;
    sei_kana: string;
    mei_kana: string;
}

export type ShopInfo = {
    id: string;
    company_name: string;
    shop_name: string;
    email: string;
    phone_number: string;
    homepage_url: string;
    open_date_time: string;
    company_number: string;
    capital: number;
    member_count: number;
    founded_date: Date;
    ComOrFreeOption?: ComOrFreeOption | null;
    Address?: Address | null;
    Name?: Name | null;
    BankAccount?: BankAccount | null;
};

export type User = {
    id: string;
    user_name: string;
    email: string;
    phone_number: string;
    Address?: Address;
    Name?: Name;
    BankAccount?: BankAccount | null;
};