import { Transaction } from "sequelize";
import { ItemLike, ShopInfo, User } from "../../models/index.js";

export type ItemUserParams = {
    itemId: number;
    userId: number;
};

export type ItemIdParams = {
    itemId: number;
};

export type ListParams = {
    itemId: number;
    keyword?: string;
};

export type UserItemsLikesParams = {
    userId: number;
    itemWhere: any;
    limit: number;
    offset: number;
};

export type DestroyParams = {
    data: InstanceType<typeof ItemLike>;
};

export type DestroyTransactionParams = {
    itemLikes: InstanceType<typeof ItemLike>[];
    transaction: Transaction;
};

export type ItemLikeWithUser = InstanceType<typeof ItemLike> & {
    User: InstanceType<typeof User> & {
        ShopInfo: InstanceType<typeof ShopInfo> | null;
    };
};
