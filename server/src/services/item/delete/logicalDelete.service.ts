import { Op } from "sequelize";
import { Cart, Comment, Delivery, Item, ItemLike, ItemShippingProfile, Notification, Sale, Video } from "../../../models/index.js";
import { AppError } from "../../../errors.js";
import sequelize from "../../../db.js";

type Params = {
    itemId: number;
    userId: number;
};

export const deleteItemLogically = async ({ itemId, userId }: Params) => {
    const nowDate = new Date();

    const deliveryNow = await Delivery.findAll({
        where: {
            cancel: false,
            delivery_status_id: { [Op.ne]: 4 },
            orders_id: { [Op.not]: null },
        },
    });
    if (deliveryNow && deliveryNow.length > 0) {
        throw new AppError("INVALID_DELETE", 400, "取引中の商品は削除できません");
    }

    await sequelize.transaction(async (t) => {
        const item = await Item.findByPk(itemId, {
            include: [
                { model: Video },
                { model: Sale },
                { model: ItemShippingProfile },
            ],
        });

        if (!item) {
            throw new AppError("ITEM_NOT_FOUND", 404);
        }
        
        await Comment.destroy({ where: { item_id: itemId }, transaction: t });
        await ItemLike.destroy({ where: { item_id: itemId }, transaction: t });
        await Cart.destroy({ where: { item_id: itemId }, transaction: t });

        const updateItemData = {
            uploaded_at: null,
            sort_number: 0,
            sort_buzz_number: 0,
            status: "deleted",
            deleted_at: nowDate,
            price: item.Sale?.before_price ?? item.price,
        };

        if (item.Sale && item.Sale.sale_flag) {
            await item.Sale.update({
                discount_rate: 0,
                discount_amount: 0,
                sale_flag: false,
            }, { transaction: t });
        }

        await item.update(updateItemData, { transaction: t });
        
        await Notification.create({
            read_user_id: userId,
            url: `/item/deleted/${itemId}`,
            message_image: item.first_image_url,
            message: `${item.name}を削除しました。削除から1か月間はマイページの「削除した商品」、もしくはこのお知らせからアーカイブを確認・復元することができます。削除から1か月以上経過すると、アーカイブの確認・復元ができなくなりますのでご注意ください。`,
        }, { transaction: t });
    });
};