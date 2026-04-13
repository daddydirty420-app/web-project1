import { Comment } from "../models/index.js";
import { CommentIdParams, CreateCommentParams, DestroyAllParams, DestroyParams, ItemIdParams, UpdateParams } from "../types/serviceType/comment.js";

export const getComment = async ({ commentId }: CommentIdParams) => {
    return Comment.findByPk(commentId);
};

export const getAllComments = async ({ itemId }: ItemIdParams) => {
    return Comment.findAll({
        where: { item_id: itemId },
    });
};

export const updateSortNumber = async ({ comment, data }: UpdateParams) => {
    await comment.update(data);
};

export const createComment = ({ data }: CreateCommentParams) => {
    return Comment.create(data);
};

export const destroyComment = async ({ comment }: DestroyParams) => {
    await comment.destroy();
};

export const destroyAllComments = async ({ comments, transaction }: DestroyAllParams) => {
    await Promise.all(comments.map(async (comment: InstanceType<typeof Comment>) => {
        await comment.destroy({ transaction });
    }));
};

export const countItemPageComment = async ({ itemId }: ItemIdParams) => {
    return Comment.count({
        where: { item_id: itemId },
    });
};