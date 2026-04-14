import { AppError } from "../../errors.js";
import { countSellItem, countSoldItem } from "../../services/items/index.js";
import { countUnread } from "../../services/notification.js";
import { countReferenceOutput } from "../../services/referenceCode.js";
import { getMeMypage } from "../../services/users.js";

type Params = {
    userId: number;
};

export const getMyPageUseCase = async ({ userId }: Params) => {
    const user = await getMeMypage({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    const hasShop = !!user.ShopInfo;

    const itemCount = await countSellItem({ userId });

    const soldItemCount = await countSoldItem({ userId });

    const unreadCount = await countUnread({ userId });

    const referenceCount = await countReferenceOutput({ userId });

    return {
        user,
        hasShop,
        itemCount,
        soldItemCount,
        unreadCount,
        referenceCount
    };
};