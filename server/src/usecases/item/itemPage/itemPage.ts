import { AppError } from "../../../errors.js";
import { countItemPageComment } from "../../../services/comment.js";
import { countItemLike, findItemLike } from "../../../services/itemLike.js";
import { getItemPageData } from "../../../services/items/index.js";
import { getMeHighlight } from "../../../services/users.js";
import { ItemPageMode } from "../../../types/usecaseType.js";

type Params = {
    itemId: number;
    userId: number | null;
    mode: ItemPageMode;
};

export const getItemPageUseCase = async ({ itemId, userId, mode }: Params) => {
    // itemデータ取得
    const item = await getItemPageData({ itemId });
    
    if (!item
        || mode === "normal" && !(["active", "soldout"].includes(item.status))
        || (mode === "draft" && !(item.status === "draft"))
        || (mode === "confirm" && item.status === "deleted")
        || (mode === "deleted" && !(item.status === "deleted"))
    ) {
        throw new AppError("ITEM_NOTFOUND", 404);
    }

    if (mode === "normal") {
        const sellerMe = userId === item.seller_id;

        // like関連取得
        const likeCount = await countItemLike({ itemId });

        let isLikeByMe = false;

        if (!sellerMe && userId) {
            const isLike = await findItemLike({ itemId, userId });
            
            isLikeByMe = !!isLike;
        }

        // コメント数取得
        const commentCount = await countItemPageComment({ itemId });

        // 自分のユーザー情報取得
        let me = null;
        if (userId) {
            me = await getMeHighlight({ userId });
        }

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