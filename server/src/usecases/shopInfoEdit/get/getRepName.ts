import { AppError } from "../../../errors.js";
import { getShopEditHasRepName } from "../../../services/shopInfoEdit/query.js";

type Params = {
    shopEditId: number;
    userId: number;
};

// GET /shop-info-edit/:id/rep-name
// summary: shopEdit代表者氏名取得
// page: /edit/name/shop/rep-name/com-free/[id]
export const getRepNameEditUseCase = async ({ shopEditId, userId }: Params) => {
    const shopEdit = await getShopEditHasRepName({ shopEditId });

    if (shopEdit.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    const name = shopEdit.RepresentativeNameEdit;
    if (!name) throw new AppError("NAME_NOT_FOUND", 404);

    return name;
};
