import { Comment } from "../models/index.js";
import { CommentIdParams } from "../types/serviceType/comment.js";

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