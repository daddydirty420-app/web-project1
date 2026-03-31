import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { Item, Notification } from "../../../models/index.js";

type Params = {
    itemId: number;
    userId: number;
};

export const restoreItem = async ({ itemId, userId }: Params) => {
    const nowDate = new Date();

    // Item取得
    const item = await Item.findByPk(itemId);
    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    await sequelize.transaction(async (t) => {
        await item.update({
            uploaded_at: nowDate,
            status: "active",
            deleted_at: null,
        }, { transaction: t });

        await Notification.create({
            read_user_id: userId,
            url: `/item/${itemId}`,
            message_image: item.first_image_url,
            message: `「${item.name}」を復元しました。こちらから復元した商品を確認できます。`
        }, { transaction: t });
    });
};