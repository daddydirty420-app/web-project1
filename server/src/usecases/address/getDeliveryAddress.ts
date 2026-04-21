import { AppError } from "../../errors.js";
import { getDeliveryAddressOne } from "../../services/address.js";

type Params = {
    deliveryId: number;
};

export const getDeliveryAddressUseCase = async ({ deliveryId }: Params) => {
    const data = await getDeliveryAddressOne({ deliveryId });

    if (!data) throw new AppError("DELIVERY_ADDRESS_NOT_FOUND", 404);

    return data;
};
