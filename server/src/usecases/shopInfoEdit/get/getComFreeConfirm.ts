import { AppError } from "../../../errors.js";
import { getMyShopEditComFreeConfirm } from "../../../services/shopInfoEdit/query.js";

type Params = {
    shopEditId: number;
    userId: number;
};

// GET /shop-info-edit/:id/com-free-confirm
// summary: 事業形態変更確認ページデータ取得
// page: /edit/shop/com-free/confirm/[id]
export const getShopComFreeConfirmUseCase = async ({ shopEditId, userId }: Params) => {
    const shopEdit = await getMyShopEditComFreeConfirm({ shopEditId, userId });

    if (!shopEdit) throw new AppError("SHOP_EDIT_NOT_FOUND", 404);

    return shopEdit;
};
