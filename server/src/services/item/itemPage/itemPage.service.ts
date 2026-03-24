import { getCommentCount } from "./master/getCommentCount.js";
import { getItem } from "./master/getItem.js";
import { getLike } from "./master/getLike.js";
import { getMe } from "./master/getMe.js";

export type ItemPageMode = 
| "normal"
| "draft"
| "confirm"
| "deleted";

type Params = {
    itemId: number;
    userId: number | null;
    mode: ItemPageMode;
};

export const getItemPage = async ({ itemId, userId, mode }: Params) => {
    // itemデータ取得
    const item = await getItem({ itemId, mode });

    if (mode === "normal") {
        const sellerMe = userId === item.seller_id;

        // like関連取得
        const {
            likeCount,
            isLikeByMe
        } = await getLike({ itemId, userId });

        // コメント数取得
        const commentCount = await getCommentCount({ itemId });

        // 自分のユーザー情報取得
        const me = await getMe({ userId });

        return {
            item,
            sellerMe,
            likeCount,
            isLikeByMe,
            commentCount,
            me
        };
    }

    return {
        item,
        sellerMe: null,
        likeCount: null,
        isLikeByMe: null,
        commentCount: null,
        me: null
    };
};