import { AppError } from "../../../errors.js";
import { getMyShopEditHasConName } from "../../../services/shopInfoEdit/query.js";

type Params = {
    shopEditId: number;
    userId: number;
};

// GET /shop-info-edit/:id/con-name
// summary: shopEdit担当者氏名取得
// page: /edit/name/shop/con-name/com-free/[id]
export const getConNameEditUseCase = async ({ shopEditId, userId }: Params) => {
    const shopEdit = await getMyShopEditHasConName({ shopEditId, userId });

    if (!shopEdit) throw new AppError("SHOP_EDIT_NOT_FOUND", 404);

    const name = shopEdit.ContactNameEdit;
    if (!name) throw new AppError("NAME_NOT_FOUND", 404);

    return name;
};
