import { AppError } from "../../../errors.js";
import sequelize from "../../../db.js";
import { createNormalNotification } from "../../../services/notification.js";
import { getItemWithVideoSaleShipping, updateLogicalDeleteItem } from "../../../services/items/index.js";
import { destroyItemLikeTransaction, findAllItemLikes } from "../../../services/itemLike.js";
import { destroyAllComments, findAllComments } from "../../../services/comment.js";
import { destroyAllCarts, getAllCarts } from "../../../services/cart.js";
import { findDeliveryNow } from "../../../services/delivery.js";
import { updateLogicalDelete } from "../../../services/sale.js";

type Params = {
    itemId: number;
    userId: number;
};

export const deleteItemLogicallyUseCase = async ({ itemId, userId }: Params) => {
    // 配送中Delivery取得
    const deliveryNow = await findDeliveryNow({ itemId });
    if (deliveryNow && deliveryNow.length > 0) {
        throw new AppError("INVALID_DELETE", 400, "取引中の商品は削除できません");
    }
        
    // Item取得
    const item = await getItemWithVideoSaleShipping({ itemId });

    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    // 関連データ取得
    const comments = await findAllComments({ itemId });
    const itemLikes = await findAllItemLikes({ itemId });
    const carts = await getAllCarts({ itemId });

    await sequelize.transaction(async (t) => {
        // 関連データ削除
        await destroyAllComments({ comments, transaction: t });
        await destroyItemLikeTransaction({ itemLikes, transaction: t });
        await destroyAllCarts({ carts, transaction: t });

        // Saleアップデート
        if (item.Sale && item.Sale.sale_flag) {
            await updateLogicalDelete({ sale: item.Sale, transaction: t });
        }

        // Item論理削除（アップデート）
        await updateLogicalDeleteItem({
            item,
            data: {
                price: item.Sale?.before_price ?? item.before_price,
            },
            transaction: t,
        });

        // Notification作成
        await createNormalNotification({
            data: {
                read_user_id: userId,
                url: `/item/deleted/${itemId}`,
                message_image: item.first_image_url,
                message: `${item.name}を削除しました。削除から1か月間はマイページの「削除した商品」、もしくはこのお知らせからアーカイブを確認・復元することができます。削除から1か月以上経過すると、アーカイブの確認・復元ができなくなりますのでご注意ください。`,
            },
            transaction: t,
        });
    });
};