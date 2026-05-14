import { AppError } from "../../../errors.js";
import { getShopEditHasAddress } from "../../../services/shopInfoEdit/query.js";

type Params = {
    shopEditId: number;
    userId: number;
};

// GET /shop-info-edit/:id/address
// summary: shopEdit住所取得
// page: /edit/address/shop/com-free/[id]
export const getAddressShopEditUseCase = async ({ shopEditId, userId }: Params) => {
    const shopEdit = await getShopEditHasAddress({ shopEditId });

    if (shopEdit.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    const data = shopEdit.Address;
    if (!data) throw new AppError("ADDRESS_NOT_FOUND", 404);

    return data;
};
