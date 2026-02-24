export type Follow = {
    id: string;
    follow_user_id: string | number;
    follower_user_id: string | number;
};

export type ShopInfo = {
    id: string;
};

export type User = {
    id: string;
    user_name: string;
    profile_image: string | null;
    honnin_verified: boolean;
    early_seller: boolean;
    ShopInfo?: ShopInfo | null;
};