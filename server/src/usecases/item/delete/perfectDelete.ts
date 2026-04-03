import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { destroyPerfectItem, findByPkItem } from "../../../services/items.js";
import { createPerfectDelete } from "../../../services/itemDeleteLogs.js";

type Params = {
    itemId: number;
    userId: number;
};

export const deleteItemPerfectUseCase = async ({ itemId, userId }: Params) => {

    // Item取得
    const item = await findByPkItem({ itemId });
    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    // データ編集
    await sequelize.transaction(async (t) => {
        await createPerfectDelete({ itemId, userId, transaction: t });

        await destroyPerfectItem({ item, transaction: t });
    });
};