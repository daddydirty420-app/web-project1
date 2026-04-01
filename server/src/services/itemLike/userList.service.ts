import { Op } from "sequelize";
import { Follow, ItemLike, ShopInfo, User } from "../../models/index.js";

type Params = {
    itemId: number;
    userId: number;
    keyword?: string;
};

export const getItemLikeUserList = async ({ itemId, userId, keyword }: Params) => {
    type FollowInstance = InstanceType<typeof Follow>
    type UserInstance = InstanceType<typeof User>;

    const userWhere = keyword
    ? { user_name: { [Op.iLike]: `%${String(keyword).trim()}%` } }
    : undefined;

    const itemLikeList = await ItemLike.findAll({
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
    }) as UserInstance[];

    let finalLikeList = null;

    if (userId !== null) {
        const targetUserIds = itemLikeList.map(user => user.User.id);
    
        const followings = await Follow.findAll({
            where: {
                follow_user_id: userId,
                follower_user_id: targetUserIds
            }
        }) as FollowInstance[];
    
        const followingUserIdSet = new Set(followings.map(f => f.follower_user_id));
    
        finalLikeList = itemLikeList.map(item => {
            const plainItem = item.toJSON();
            const targetId = plainItem.User?.id;
            plainItem.User.is_following = followingUserIdSet.has(targetId);
            return plainItem;
        });
    }

    const source = finalLikeList ?? itemLikeList;

    const userList = source.map(item => {
        const plain = item.toJSON ? item.toJSON() : item;
        return plain.User;
    });

    return userList;
};