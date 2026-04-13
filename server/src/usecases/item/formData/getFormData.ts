import { AppError } from "../../../errors.js";
import { getAllLevel1 } from "../../../services/categories.js";
import { findAllCondition } from "../../../services/itemCondition.js";
import { getItemFormData } from "../../../services/items/index.js";
import { findAllShippingDay } from "../../../services/shippingDay.js";
import { findAllShippingService } from "../../../services/shippingService.js";
import { getAllTodouhuken } from "../../../services/todouhuken.js";
import { getHasShop } from "../../../services/users.js";

type Params = {
    itemId: number;
};

export const getFormDataUseCase = async ({ itemId }: Params) => {
    // Item取得
    const item = await getItemFormData({ itemId });

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
        getAllLevel1(),
        findAllCondition(),
        findAllShippingDay(),
        findAllShippingService(),
        getAllTodouhuken(),
        getHasShop({ userId: item.seller_id })
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