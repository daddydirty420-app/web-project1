export type User = {
    user_name: string;
    profile_image: string;
};

export type Video = {
    thumbnail_url: string;
    title: string;
    duration: string;
};

export type Sale = {
    sale_flag: boolean;
    before_price: number;
    discount_rate: number;
    discount_amount: number;
};

export type Items = {
    id: string;
    name: string;
    price: number;
    public: boolean;
    sold_out: boolean;
    uploaded_date: Date;
    seller_id: string;
    first_image_url: string;
    Video: Video | null;
    Sale: Sale | null;
    User: User | null;
};