import { CommentLike, ShopInfo, User } from '../../models/index.js';

export type CommentIdParams = {
    commentId: number;
};

export type CommentUserParams = {
    commentId: number;
    userId: number;
};

export type ListParams = {
    commentId: number;
    keyword?: string;
};

export type DestroyParams = {
    data: InstanceType<typeof CommentLike>;
};

export type CommentLikeWithUser = InstanceType<typeof CommentLike> & {
    User: InstanceType<typeof User> & {
        ShopInfo: InstanceType<typeof ShopInfo> | null;
    };
};
