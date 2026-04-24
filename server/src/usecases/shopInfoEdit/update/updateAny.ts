import { AppError } from "../../../errors.js";
import { updateShopEditAny } from "../../../services/shopInfoEdit/command.js";
import { getShopEdit } from "../../../services/shopInfoEdit/query.js";

type Params = {
    shopEditId: number;
    userId: number;
    updateData: any;
};

export const updateShopEditAnyUseCase = async ({ shopEditId, userId, updateData }: Params) => {
    // shopEdit取得
    const shopEdit = await getShopEdit({ shopEditId });

    if (!shopEdit) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shopEdit.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    // db更新
    await updateShopEditAny({
        shopEdit,
        data: updateData,
    });
};
