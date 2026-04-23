import { AppError } from "../../../errors.js";
import { getShopEditHasRepName } from "../../../services/shopInfoEdit.js";

type Params = {
    shopEditId: number;
    userId: number;
};

export const getRepNameEditUseCase = async ({ shopEditId, userId }: Params) => {
    const shopEdit = await getShopEditHasRepName({ shopEditId });

    if (shopEdit.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    const name = shopEdit.Name;
    if (!name) throw new AppError("NAME_NOT_FOUND", 404);

    return name;
};
