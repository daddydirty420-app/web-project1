import { AppError } from "../../errors.js";
import { getShopEditHasRepName } from "../../services/shopInfoEdit.js";

type Params = {
    shopEditId: number;
};

export const getRepNameEditUseCase = async ({ shopEditId }: Params) => {
    const shopEdit = await getShopEditHasRepName({ shopEditId });

    const name = shopEdit.Name;
    if (!name) throw new AppError("NAME_NOT_FOUND", 404);

    return name;
};
