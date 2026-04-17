export type FollowType = "follow" | "follower";

export type FollowingsParams = {
    currentUserId: number;
    targetUserIds: number[];
};

export type UserParams = {
    currentUserId: number;
    targetUserId: number;
};

export type CountParams = {
    userId: number;
};

export type ListParams = {
    pageUserId: number;
    type: FollowType;
    keyword?: string;
};
