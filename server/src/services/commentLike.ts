import { Op } from "sequelize";
import { CommentLike, ShopInfo, User } from "../models/index.js";
import { CommentUserParams, ListParams } from "../types/serviceType/commentLike.js";

type DestroyParams = {
    data: InstanceType<typeof CommentLike>;
};

type CommentLikeWithUser = InstanceType<typeof CommentLike> & {
    User: InstanceType<typeof User> & {
        ShopInfo: InstanceType<typeof ShopInfo> | null;
    };
};

export const findCommentLike = async ({ commentId, userId }: CommentUserParams) => {
    return CommentLike.findOne({
        where: {
            comment_id: commentId,
            user_id: userId,
        },
    });
};

export const createCommentLike = async ({ commentId, userId }: CommentUserParams) => {
    return CommentLike.create({
        comment_id: commentId,
        user_id: userId,
    });
};

export const destroyCommentLike = async ({ data }: DestroyParams) => {
    await data.destroy();
};

export const getCommentLikeList = async ({ commentId, keyword }: ListParams) => {    
    const userWhere = keyword
    ? { user_name: { [Op.iLike]: `%${String(keyword).trim()}%` } }
    : undefined;

    return CommentLike.findAll({
        attributes: ["id"],
        where: { comment_id: commentId },
        order: [['createdAt', 'DESC']],
        distinct: true,
        include: [
            {
                model: User,
                where: userWhere,
                required: !!keyword,
                attributes: ['id', 'user_name', 'profile_image', 'honnin_verified', "early_seller"],
                include: [
                    {
                        model: ShopInfo,
                        attributes: ['id'],
                        required: false,
                    },
                ],
            },
        ],
    }) as unknown as CommentLikeWithUser[];
};