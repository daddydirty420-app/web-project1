import { Follow, User } from "../../models/index.js";

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

export type DestroyParams = {
    follow: InstanceType<typeof Follow>;
};

export type FollowWithUser = InstanceType<typeof Follow> & {
    FollowerUser: InstanceType<typeof User>;
    FollowUser: InstanceType<typeof User>;
};
