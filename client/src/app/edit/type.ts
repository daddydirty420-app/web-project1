export type TodouhukenOption = {
    id: string;
    name: string;
};

export type Address = {
    id: string;
    post_number: string;
    todouhuken_id: number;
    shikutyouson: string;
    banchi: string;
    building: string;
    AddressTodouhuken: TodouhukenOption;
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

export type GenderOption = {
    id: string;
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