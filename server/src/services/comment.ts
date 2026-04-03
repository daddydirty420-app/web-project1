import { Comment } from "../models/index.js";
import { CommentIdParams, ItemIdParams } from "../types/serviceType/comment.js";

type UpdateParams = {
    comment: InstanceType<typeof Comment>;
    data: {
        sort_number: number;
    };
};

export const findByPkComment = async ({ commentId }: CommentIdParams) => {
    return Comment.findByPk(commentId);
};

export const updateSortNumber = async ({ comment, data }: UpdateParams) => {
    await comment.update(data);
};

export const countItemPageComment = async ({ itemId }: ItemIdParams) => {
    return Comment.count({
        where: { item_id: itemId },
    });
};