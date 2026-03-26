import { Item, ItemDeleteLogs } from "../../../models/index.js";
import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";

type Params = {
    itemId: number;
    userId: number;
};

export const deleteItemPerfect = async ({ itemId, userId }: Params) => {

    // Item取得
    const item = await Item.findByPk(itemId);
    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    await sequelize.transaction(async (t) => {
        await ItemDeleteLogs.create({
            item_id: itemId,
            user_id: userId,
            delete_by_admin: false,
            delete_reason: "自主削除"
        }, { transaction: t });

        await item.destroy({ transaction: t });
    });
};