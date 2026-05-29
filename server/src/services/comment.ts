import { Comment, User } from "../models/index.js";
import {
    CommentIdParams,
    CreateCommentParams,
    DeleteCommentUserIdTransactionParams,
    DestroyAllParams,
    DestroyParams,
    ItemIdParams,
    UpdateParams,
    UpdateReportScoreParams,
} from "../types/serviceType/comment.js";

export const getComment = ({ commentId }: CommentIdParams) => {
    return Comment.findByPk(commentId);
};

export const getAllComments = ({ itemId }: ItemIdParams) => {
    return Comment.findAll({
        where: { item_id: itemId },
        limit: 100,
    });
};

export const getAllCommentsItemPage = ({ itemId }: ItemIdParams) => {
    return Comment.findAll({
        where: {
            item_id: itemId,
            parent_comment_id: null,
        },
        order: [
            ["pin", "DESC"],
            ["sort_number", "DESC"],
            ["createdAt", "DESC"],
        ],
        include: [
            {
                model: User,
                attributes: ["id", "user_name", "profile_image"],
            },
        ],
    });
};

export const getAllReply = ({ commentId }: CommentIdParams) => {
    return Comment.findAll({
        where: { parent_comment_id: commentId },
        order: [
            ["sort_number", "DESC"],
            ["createdAt", "DESC"],
        ],
        include: [
            {
                model: User,
                attributes: ["id", "user_name", "profile_image"],
            },
        ],
    });
};

export const updateSortNumber = async ({ comment, data }: UpdateParams) => {
    await comment.update(data);
};

export const updateReportScore = async ({ comment, data, transaction }: UpdateReportScoreParams) => {
    await comment.update(data, { transaction });
};

export const createComment = ({ data }: CreateCommentParams) => {
    return Comment.create(data);
};

export const destroyComment = async ({ comment }: DestroyParams) => {
    await comment.destroy();
};

export const destroyAllComments = async ({ comments, transaction }: DestroyAllParams) => {
    await Promise.all(
        comments.map(async (comment: InstanceType<typeof Comment>) => {
            await comment.destroy({ transaction });
        }),
    );
};

export const deleteCommentUserLogical = async ({ userId, transaction }: DeleteCommentUserIdTransactionParams) => {
    await Comment.destroy(
        {
            where: { user_id: userId },
        },
        { transaction },
    );
};

export const countItemPageComment = ({ itemId }: ItemIdParams) => {
    return Comment.count({
        where: { item_id: itemId },
    });
};

export const countReply = async ({ commentId }: CommentIdParams) => {
    return Comment.count({
        where: { parent_comment_id: commentId },
    });
};
