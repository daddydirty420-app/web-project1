import { Op } from "sequelize";
import { CommentLike, Follow, ShopInfo, User } from "../../models/index.js";
import { getCommentLikeList } from "../../services/commentLike.js";
import { getFollowings } from "services/follow.js";

type Params = {
    commentId: number;
    userId: number;
    keyword?: string;
};

export const getCommentLikeUserListUseCase = async ({ commentId, userId, keyword }: Params) => {

    // いいねリスト取得
    const commentLikeList = await getCommentLikeList({ commentId, keyword });

    // フォロー状態の付与
    let finalLikeList = null;

    if (userId !== null) {
        const targetUserIds = commentLikeList.map(user => user.User.id);

        const currentUserId = userId;
    
        const followings = await getFollowings({ currentUserId, targetUserIds });
    
        const followingUserIdSet = new Set(followings.map(f => f.follower_user_id));
    
        finalLikeList = commentLikeList.map(item => {
            const plainItem = item.toJSON();
            const targetId = plainItem.User?.id;
            plainItem.User.is_following = followingUserIdSet.has(targetId);
            return plainItem;
        });
    }

    // ユーザー情報
    const source = finalLikeList ?? commentLikeList;

    const userList = source.map(item => {
        const plain = item.toJSON ? item.toJSON() : item;
        return plain.User;
    });

    return userList;
};