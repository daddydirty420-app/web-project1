import { Transaction } from "sequelize";
import { Comment } from "../../models/index.js";

export type CommentIdParams = {
    commentId: number;
};

export type ItemIdParams = {
    itemId: number;
};

export type UpdateParams = {
    comment: InstanceType<typeof Comment>;
    data: {
        sort_number: number;
    };
};

export type DestroyParams = {
    comment: InstanceType<typeof Comment>;
};

export type DestroyAllParams = {
    comments: InstanceType<typeof Comment>[];
    transaction: Transaction;
};