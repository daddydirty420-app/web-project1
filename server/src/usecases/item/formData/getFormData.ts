import { AppError } from "../../../errors.js";
import { findAllLevel1 } from "../../../services/categories.js";
import { findAllCondition } from "../../../services/itemCondition.js";
import { getItemFormDataNormal, getItemFormDataOther } from "../../../services/items.js";
import { findAllShippingDay } from "../../../services/shippingDay.js";
import { findAllShippingService } from "../../../services/shippingService.js";
import { findAllTodouhuken } from "../../../services/todouhuken.js";
import { findByPkHasShop } from "../../../services/users.js";
import { FormDataMode } from "../../../types/serviceType/items.js";

type Params = {
    itemId: number;
    mode: FormDataMode;
};

export const getFormDataUseCase = async ({ itemId, mode }: Params) => {
    // Item取得
    const service = mode === "normal" ? getItemFormDataNormal : getItemFormDataOther;

    const item = await service({ itemId });

    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    const [
        category,
        allCondition,
        allDay,
        allService,
        allPlace,
        userHasShop
    ] = await Promise.all([
        findAllLevel1(),
        findAllCondition(),
        findAllShippingDay(),
        findAllShippingService(),
        findAllTodouhuken(),
        findByPkHasShop({ userId: item.seller_id })
    ]);

    const hasShop = !!userHasShop.ShopInfo;

    return {
        item,
        category,
        allCondition,
        allDay,
        allService,
        allPlace,
        hasShop
    };
};