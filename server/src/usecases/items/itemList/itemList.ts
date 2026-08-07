import { AppError } from "../../../errors.js";
import type { ItemListQuery } from "../../../validators/query/items.js";
import { getIndexItemsUseCase } from "./index/indexItemList.js";
import { getIndexVideosUseCase } from "./index/indexVideoList.js";
import { getProfileItemsUseCase } from "./profile/profileItemList.js";
import { getProfileVideosUseCase } from "./profile/profileVideoList.js";

type Params = ItemListQuery & {
    userId: number | null;
};

type Result =
    | Awaited<ReturnType<typeof getIndexItemsUseCase>>
    | Awaited<ReturnType<typeof getIndexVideosUseCase>>
    | Awaited<ReturnType<typeof getProfileItemsUseCase>>
    | Awaited<ReturnType<typeof getProfileVideosUseCase>>;

// GET /items?type=""&page=number&view=""&limit=number(&pageUserId=${id})
// summary: 商品リスト取得
// page: /lp・/profile
export const getItemListUseCase = async ({ userId, type, page, view, limit, pageUserId }: Params): Promise<Result> => {
    if (view === "index") {
        if (type === "video") {
            return await getIndexVideosUseCase({ page, limit, userId });
        }

        if (type === "item") {
            return await getIndexItemsUseCase({ page, limit, userId });
        }
    }

    if (view === "profile") {
        if (!pageUserId) {
            throw new AppError("PAGE_USER_NOT_FOUND", 404);
        }

        if (type === "video") {
            return await getProfileVideosUseCase({ page, limit, pageUserId });
        }

        if (type === "item") {
            return await getProfileItemsUseCase({ page, limit, pageUserId });
        }
    }

    throw new AppError("INVALID_VIEW_OR_TYPE", 400);
};
