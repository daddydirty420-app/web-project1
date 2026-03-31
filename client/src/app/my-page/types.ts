export type User = {
    id: number;
    user_name: string;
    profile_image: string;
    early_seller: boolean;
    honnin_verified: boolean;
    points: number;
    uriagekin: number;
};

export type Res = {
    userData: {
        user: User;
        hasShop: boolean;
    };
    itemCount: number;
    soldItemCount: number;
    unreadCount: number;
    referenceCount: number;
};