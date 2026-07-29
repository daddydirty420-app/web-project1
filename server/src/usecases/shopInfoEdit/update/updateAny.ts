import { AppError } from "../../../errors.js";
import { updateShopEditAny } from "../../../services/shopInfoEdit/command.js";
import { getMyShopEdit } from "../../../services/shopInfoEdit/query.js";

type Params = {
    shopEditId: number;
    userId: number;
    updateData: any;
};

// PATCH /shop-info-edit/:id
// summary: 事業形態変更確認ページ　データ更新
// page: /edit/shop/com-free/confirm/[id]
export const updateShopEditAnyUseCase = async ({ shopEditId, userId, updateData }: Params) => {
    // shopEdit取得
    const shopEdit = await getMyShopEdit({ shopEditId, userId });

    if (!shopEdit) throw new AppError("SHOP_NOT_FOUND", 404);

    // db更新
    await updateShopEditAny({
        shopEdit,
        data: updateData,
    });
};
