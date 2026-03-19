import { getItemByMode } from "./master/getItemByMode.js";
import { checkHasShop, getCategories, getConditions, getPlaces, getShippingDays, getShippingServices } from "./master/getMaster.js";

export type FormDataMode = 
| "normal"
| "draft"
| "edit";

type Params = {
    itemId: number;
    mode: FormDataMode;
};

export const getFormData = async ({ itemId, mode }: Params) => {
    const item = await getItemByMode({ itemId, mode });

    const [
        category,
        allCondition,
        allDay,
        allService,
        allPlace,
        hasShop
    ] = await Promise.all([
        getCategories(),
        getConditions(),
        getShippingDays(),
        getShippingServices(),
        getPlaces(),
        checkHasShop(item.seller_id)
    ]);

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