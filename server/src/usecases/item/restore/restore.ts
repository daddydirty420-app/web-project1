import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { findByPkItem, updateRestoreItem } from "../../../services/items.js";
import { createNormalNotification } from "../../../services/notification.js";

type Params = {
    itemId: number;
    userId: number;
};

export const restoreItemUseCase = async ({ itemId, userId }: Params) => {
    // Item取得
    const item = await findByPkItem({ itemId });
    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    // データ作成
    await sequelize.transaction(async (t) => {
        await updateRestoreItem({ item, transaction: t });

        await createNormalNotification({
            data: {
                read_user_id: userId,
                url: `/item/${itemId}`,
                message_image: item.first_image_url,
                message: `「${item.name}」を復元しました。こちらから復元した商品を確認できます。`
            },
            transaction: t
        });
    });
};