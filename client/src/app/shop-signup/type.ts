export type ComOrFreeOption = {
    id: number;
    name: string;
};

export type TodouhukenOption = {
    id: number;
    name: string;
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
    conpany_name: string;
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
};

export type User = {
    id: string;
    user_name: string;
    email: string;
    phone_number: string;
    Address?: Address;
    Name?: Name;
};