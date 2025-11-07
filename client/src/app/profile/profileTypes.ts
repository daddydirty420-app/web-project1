import { Items } from "types/itemListTypes";

export type ShopInfo = {
    id: number;
} | null;

export type User = {
    id: number;
    user_name: string;
    user_introduction: string;
    profile_image: string;
    early_seller: boolean;
    honnin_verified: boolean;
    star_amount: number;
    star_average: number;
    ShopInfo?: ShopInfo;
    penalty_points: number;
    uriagekin: number;
};

export type DefaultVideoList = {
    items: Items[] | null;
    hasItemCount: number;
    totalPages: number;
};

export type Res = {
    user: User;
    hasShop: boolean;
    itemList: DefaultVideoList;
};