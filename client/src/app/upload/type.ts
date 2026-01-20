import { BodyCategory, Layer, LifeStyleCategory } from "@/types/itemAttributes";

export type Brands = {
    id: string;
    name: string;
};

export type Categories = {
    id: string;
    name: string;
    level: number;
    allowed_gender: "men" | "women" | "both";
    allowed_age: "adult" | "kids" | "both";
    parent_id: number;
    body_category: BodyCategory;
    lifestyle_category: LifeStyleCategory;
    layer: Layer;
};

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
    image_url: string[];
    name: string;
    detail: string;
    seller_id: string | number;
    gender_type: "men" | "women" | "unisex";
    age_type: "adult" | "kids" | "both";
    Video?: Video | null;
    Sale?: Sale | null;
    Category?: Categories | null;
    Brands?: Brands | null;
};