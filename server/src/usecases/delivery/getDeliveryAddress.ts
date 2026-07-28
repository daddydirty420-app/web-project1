import { AppError } from "../../errors.js";
import { getDeliveryHasAddress } from "../../services/delivery.js";

type Params = {
    deliveryId: number;
};

// GET /delivery/:id/address
// summary: 配送用住所取得
// page: /edit/address/delivery/[id]
export const getDeliveryAddressUseCase = async ({ deliveryId }: Params) => {
    const delivery = await getDeliveryHasAddress({ deliveryId });

    if (!delivery) throw new AppError("DELIVERY_DATA_NOT_FOUND", 404);

    const address = delivery.Address;

    if (!address) throw new AppError("ADDRESS_NOT_FOUND", 404);

    return address;
};
