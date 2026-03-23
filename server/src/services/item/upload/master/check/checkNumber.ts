import { AppError } from "../../../../../errors.js";
import { Body } from "../../../../../types/items/uploadBody.js";
import { toNullableNumber } from "../../utils/toNullableNumber.js";

type Params = {
    body: Body;
};

export const checkNumber = ({ body }: Params) => {
    const {
        category,
        condition,
        shipping,
        price
    } = body;

    // 数値チェック
    const categoryId = toNullableNumber(category.id);

    const conditionId = toNullableNumber(condition.id);

    const dayId = toNullableNumber(shipping.day);

    const serviceId = toNullableNumber(shipping.service);

    const placeId = toNullableNumber(shipping.place);

    const priceNum = price === "" ? 0 : Number(price);
    if (priceNum !== 0 && Number.isNaN(priceNum)) {
        throw new AppError("INVALID_PRICE", 400);
    }

    return {
        categoryId,
        conditionId,
        dayId,
        serviceId,
        placeId,
        priceNum
    };
};