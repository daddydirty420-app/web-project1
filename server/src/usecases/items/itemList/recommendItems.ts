import { AppError } from "../../../errors.js";
import type { RecommendItemsQuery } from "../../../validators/query/items.js";
import { getCartRecommendUseCase } from "./recommend/cartRecommend.js";
import { getIndexRecommendUseCase } from "./recommend/indexRecommend.js";
import { getItemPageRecommendUseCase } from "./recommend/itemPageRecommend.js";

type Params = RecommendItemsQuery & {
    userId: number | null;
};

type Result =
    | Awaited<ReturnType<typeof getCartRecommendUseCase>>
    | Awaited<ReturnType<typeof getIndexRecommendUseCase>>
    | Awaited<ReturnType<typeof getItemPageRecommendUseCase>>;

// GET /items/recommend?view=""(&itemId=number)
// summary: レコメンドリスト取得
// page: /item・/item-list/cart・/など
export const getRecommendItemsUseCase = async ({ userId, view, itemId }: Params): Promise<Result> => {
    if (view === "recommend") {
        return await getIndexRecommendUseCase({ userId });
    }

    if (view === "cart") {
        return await getCartRecommendUseCase({ userId });
    }

    if (view === "itemPage") {
        if (!itemId) {
            throw new AppError("INVALID_QUERY", 400);
        }

        return await getItemPageRecommendUseCase({ userId, itemId });
    }

    throw new AppError("INVALID_VIEW", 400);
};
