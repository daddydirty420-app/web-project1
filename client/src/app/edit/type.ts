export type AccountTypeOption = {
    id: number;
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
    AccountTypeOption?: AccountTypeOption | null;
};

export type TodouhukenOption = {
    id: number;
    name: string;
};

export type Address = {
    id: string;
    post_number: string;
    todouhuken_id: number;
    shikutyouson: string;
    banchi: string;
    building: string;
    AddressTodouhuken?: TodouhukenOption | null;
};

export type IdCard = {
    id: string;
    id_card_front: string;
    id_card_rear: string;
};

export type Name = {
    id: string;
    sei: string;
    mei: string;
    sei_kana: string;
    mei_kana: string;
    delivery_id: number;
};

export type ComOrFreeOption = {
    id: number;
    name: string;
};

export type ShopInfoEdit = {
    id: string;
    company_name?: string | null;
    email?: string | null;
    phone_number?: string | null;
    homepage_url?: string | null;
    open_date_time?: string | null;
    company_number?: string | null;
    capital?: number | null;
    member_count?: number | null;
    founded_date?: Date | null;
    id_card_front?: string | null;
    id_card_rear?: string | null;
    ComOrFreeOption?: ComOrFreeOption | null;
    Address?: Address | null;
    Name?: Name | null;
    BankAccount?: BankAccount | null;
    RepresentativeNameEdit?: Name | null;
    ContactNameEdit?: Name | null;
    ShopInfo: ShopInfo;
};

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
    id_card_front: string;
    id_card_rear: string;
    permit_url: string[];
    auto_trans: boolean;
    open_info: boolean;
    ComOrFreeOption?: ComOrFreeOption | null;
    Address?: Address | null;
    RepresentativeName?: Name | null;
    ContactName?: Name | null;
    BankAccount?: BankAccount | null;
};

export type GenderOption = {
    id: number;
    name: string;
};

export type User = {
    id: string;
    user_name: string;
    user_introduction: string;
    profile_image: string;
    phone_number: string;
    birthday: Date;
    gender_id: number;
    Name?: Name;
    Address?: Address;
    IdCard?: IdCard;
    GenderOption?: GenderOption;
};
