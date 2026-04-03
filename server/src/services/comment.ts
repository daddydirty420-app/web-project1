import { Transaction } from "sequelize";
import { Comment } from "../models/index.js";
import { CommentIdParams, ItemIdParams } from "../types/serviceType/comment.js";

type UpdateParams = {
    comment: InstanceType<typeof Comment>;
    data: {
        sort_number: number;
    };
};

type DestroyAllParams = {
    comments: InstanceType<typeof Comment>[];
    transaction: Transaction;
};

export const findByPkComment = async ({ commentId }: CommentIdParams) => {
    return Comment.findByPk(commentId);
};

export const findAllComments = async ({ itemId }: ItemIdParams) => {
    return Comment.findAll({
        where: { item_id: itemId },
    });
};

export const updateSortNumber = async ({ comment, data }: UpdateParams) => {
    await comment.update(data);
};

export const countItemPageComment = async ({ itemId }: ItemIdParams) => {
    return Comment.count({
        where: { item_id: itemId },
    });
};

export const destroyAllComments = async ({ comments, transaction }: DestroyAllParams) => {
    await Promise.all(comments.map(async (comment: InstanceType<typeof Comment>) => {
        await comment.destroy({ transaction });
    }));
};