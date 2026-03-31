import { Categories, ItemConditionOption, ShippingDayOption, ShippingServiceOption, TodouhukenOption } from "../../../../../models/index.js";
import { AppError } from "../../../../../errors.js";

type Params = {
    categoryId: number | null;
    conditionId: number | null;
    dayId: number | null;
    serviceId: number | null;
    placeId: number | null;
};

export const checkMasterTable = async ({
    categoryId,
    conditionId,
    dayId,
    serviceId,
    placeId
}: Params) => {

    // マスターテーブルチェック
    let categoryOption = null;
    if (categoryId !== null && categoryId !== 0) {
        categoryOption = await Categories.findByPk(categoryId);
        if (!categoryOption) {
            throw new AppError("CATEGORY_NOT_FOUND", 404);
        }
    }
    
    if (conditionId !== null && conditionId !== 0) {
        const conditionOption = await ItemConditionOption.findByPk(conditionId);
        if (!conditionOption) {
            throw new AppError("ITEM_CONDITION_NOT_FOUND", 404);
        }
    }
    
    if (dayId !== null && dayId !== 0) {
        const dayOption = await ShippingDayOption.findByPk(dayId);
        if (!dayOption) {
            throw new AppError("SHIPPING_DAY_NOT_FOUND", 404);
        }
    }
    
    if (serviceId !== null && serviceId !== 0) {
        const serviceOption = await ShippingServiceOption.findByPk(serviceId);
        if (!serviceOption) {
            throw new AppError("SHIPPING_SERVICE_NOT_FOUND", 404);
        }
    }

    if (placeId !== null && placeId !== 0) {
        const placeOption = await TodouhukenOption.findByPk(placeId);
        if (!placeOption) {
            throw new AppError("PLACE_NOT_FOUND", 404);
        }
    }

    return categoryOption;
};