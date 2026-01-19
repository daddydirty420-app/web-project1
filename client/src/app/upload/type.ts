export type ItemShippingProfile = {
    id: string;
};

export type Sale = {
    id: string;
    shop_id: string | number;
};

export type Video = {
    id: string;
    original_url: string;
    converted_url: string;
    thumbnail_url: string;
    title: string;
    summary: string;
    user_id: string | number;
    shop_id: string | number;
};

export type Item = {
    id: string;
    name: string;
    detail: string;
    user_id: string | number;
    Video?: Video | null;
    Sale?: Sale | null;
};