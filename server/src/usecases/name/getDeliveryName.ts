import { AppError } from "../../errors.js";
import { getDeliveryNameOne } from "../../services/name.js";

type Params = {
    deliveryId: number;
};

// GET /name/:id/delivery-name
// summary: 配送用氏名取得
// page: /edit/name/delivery/[id]
export const getDeliveryNameUseCase = async ({ deliveryId }: Params) => {
    const data = await getDeliveryNameOne({ deliveryId });

    if (!data) throw new AppError("NAME_NOT_FOUND", 404);

    return data;
};
