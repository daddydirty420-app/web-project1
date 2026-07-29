import { AppError } from "../../../errors.js";

type Params = {
    shopId: number;
    userId: number;
};

// GET /shop-info/:id/rep-name
// summary: 代表者氏名取得
// page: /edit/name/shop/rep-name/[id]・/edit/name/shop/rep-name/signup/[id]
export const getRepNameUseCase = async ({ shopId, userId }: Params) => {
    const shop = await getMyShopHasRepName({ shopId });

    const name = shop.RepresentativeName;
    if (!name) throw new AppError("NAME_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    return { shop, name };
};
