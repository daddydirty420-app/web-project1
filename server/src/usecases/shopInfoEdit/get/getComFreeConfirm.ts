import { AppError } from "../../../errors.js";
import { getShopEditComFreeConfirm } from "../../../services/shopInfoEdit/query.js";

type Params = {
    shopEditId: number;
    userId: number;
};

// GET /shop-info-edit/:id/com-free-confirm
// summary: 事業形態変更確認ページデータ取得
// page: /edit/shop/com-free/confirm/[id]
export const getShopComFreeConfirmUseCase = async ({ shopEditId, userId }: Params) => {
    const shopEdit = await getShopEditComFreeConfirm({ shopEditId });

    if (!shopEdit) throw new AppError("SHOP_EDIT_NOT_FOUND", 404);
    if (shopEdit.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    return shopEdit;
};
