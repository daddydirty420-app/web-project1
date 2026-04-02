import { Op } from "sequelize";
import { ItemLike, ShopInfo, User } from "../models/index.js";

type ItemUserParams = {
    itemId: number;
    userId: number;
};

type DestroyParams = {
    data: InstanceType<typeof ItemLike>;
};

type ItemIdParams = {
    itemId: number;
};

type ListParams = {
    itemId: number;
    userId: number;
    keyword?: string;
};

type ItemLikeWithUser = InstanceType<typeof ItemLike> & {
    User: InstanceType<typeof User> & {
        ShopInfo: InstanceType<typeof ShopInfo> | null;
    };
};

export const findItemLike = async ({ itemId, userId }: ItemUserParams) => {
    return ItemLike.findOne({
        where: {
            item_id: itemId,
            user_id: userId,
        },
    });
};

export const createItemLike = async ({ itemId, userId }: ItemUserParams) => {
    return ItemLike.create({
        item_id: itemId,
        user_id: userId,
    });
};

export const destroyItemLike = async ({ data }: DestroyParams) => {
    await data.destroy();
};

export const countItemLike = async ({ itemId }: ItemIdParams) => {
    return await ItemLike.count({
        where: { item_id: itemId },
    });
};

export const getItemLikeList = async ({ itemId, userId, keyword }: ListParams) => {
    const userWhere = keyword
    ? { user_name: { [Op.iLike]: `%${String(keyword).trim()}%` } }
    : undefined;

    return ItemLike.findAll({
        attributes: ["id"],
        where: { item_id: itemId },
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
    }) as unknown as ItemLikeWithUser[];
};