import { AppError } from "../../../errors.js";
import { getMyShopEditHasAddress } from "../../../services/shopInfoEdit/query.js";

type Params = {
    shopEditId: number;
    userId: number;
};

// GET /shop-info-edit/:id/address
// summary: shopEdit住所取得
// page: /edit/address/shop/com-free/[id]
export const getAddressShopEditUseCase = async ({ shopEditId, userId }: Params) => {
    const shopEdit = await getMyShopEditHasAddress({ shopEditId, userId });

    if (!shopEdit) throw new AppError("SHOP_EDIT_NOT_FOUND", 404);

    const data = shopEdit.Address;
    if (!data) throw new AppError("ADDRESS_NOT_FOUND", 404);

    return data;
};
