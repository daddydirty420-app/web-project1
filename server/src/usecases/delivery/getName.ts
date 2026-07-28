import { AppError } from "../../errors.js";
import { getDeliveryHasName } from "../../services/delivery.js";

type Params = {
    deliveryId: number;
};

// GET /delivery/:id/name
// summary: 配送用氏名取得
// page: /edit/name/delivery/[id]
export const getDeliveryNameUseCase = async ({ deliveryId }: Params) => {
    const delivery = await getDeliveryHasName({ deliveryId });

    if (!delivery) throw new AppError("DELIVERY_NOT_FOUND", 404);

    const name = delivery.Name;

    if (!name) throw new AppError("NAME_NOT_FOUND", 404);

    return name;
};
