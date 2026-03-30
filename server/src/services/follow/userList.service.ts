import { Op } from "sequelize";
import { AppError } from "../../errors.js";
import { Follow, ShopInfo, User } from "../../models/index.js";

export type FollowType = 
| "follow"
| "follower";

type Params = {
    currentUserId: number | null;
    pageUserId: number;
    type: FollowType;
    keyword?: string;
};

type FollowWithUser = InstanceType<typeof Follow> & {
    FollowerUser: InstanceType<typeof User>;
    FollowUser: InstanceType<typeof User>;
};

export const getFollowUserList = async ({ currentUserId, pageUserId, type, keyword }: Params) => {

    const myFollow = currentUserId === pageUserId;

    const where = type === "follow"
    ? { follow_user_id: pageUserId }
    : { follower_user_id: pageUserId };

    const as = type === "follow"
    ? "FollowerUser"
    : "FollowUser";

    const userWhere = keyword
    ? { user_name: { [Op.iLike]: `%${String(keyword).trim()}%` } }
    : undefined;

    // フォロー・フォロワーのリスト
    const followList = await Follow.findAll({
        attributes: ["id"],
        where,
        order: [["createdAt", "DESC"]],
        distinct: true,
        include: [
            {
                model: User,
                as,
                where: userWhere,
                required: !!keyword,
                attributes: ['id', 'user_name', 'profile_image', 'honnin_verified', "early_seller"],
                include: [
                    {
                        model: ShopInfo,
                        attributes: ["id"],
                        required: false
                    },
                ],
            },
        ],
    }) as FollowWithUser[];

    // 自分がフォローしているかどうか（is_following）を追加
    let finalFollowList = null;

    if (currentUserId !== null && followList.length > 0 && !myFollow) {
        const targetUserIds = followList.map(
            (user: InstanceType<typeof Follow>) => user.FollowerUser.id);

        const followings = await Follow.findAll({
            where: {
                follow_user_id: currentUserId,
                follower_user_id: targetUserIds
            }
        }) as InstanceType<typeof Follow>[];

        const followingUserIdSet = new Set(followings.map(
            (f: InstanceType<typeof Follow>) => f.follower_user_id));

        finalFollowList = followList.map(
            (item) => {
            const plainItem = item.toJSON();
            const targetId = plainItem.FollowerUser?.id;
            plainItem.FollowerUser.is_following = followingUserIdSet.has(targetId);
            return plainItem;
        });
    }

    const source = finalFollowList ?? followList;

    const userList = source.map(item => {
        const plain = item.toJSON ? item.toJSON() : item;
        return plain.FollowerUser;
    });

    const pageUser = await User.findByPk(pageUserId, {
        attributes: ['id', 'user_name'],
    });

    if (!pageUser) {
        throw new AppError("PAGE_USER_NOT_FOUND", 404);
    }

    return {
        userList,
        pageUser
    };
};