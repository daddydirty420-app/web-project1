import { Op } from "sequelize";
import { Item, Video, Delivery, ItemDeleteLogs, Sale, Notification, DeletedItems, PaidInfo, PaymentMethodOption, Cancel, DeletedOrderSystems } from "../models/index.js";
import sequelize from "../db.js";
import moveToGlacier from "./moveToGlacier.js";

async function adminDeleteItem(itemId: number, adminId: number, deleteReason: string) {
    const item = await Item.findByPk(itemId, {
        include: [
            { model: Sale },
            { model: Video },
            {
                model: Delivery,
                as: "ParentDelivery",
            }
        ]
    });

    const sellerId = item.seller_id;

    const t = await sequelize.transaction();
    try {
        await Notification.create({
            read_user_id: sellerId,
            url: `/profile/${sellerId}`,
            message: `平素よりFLEX OUTDOORをご利用いただき誠にありがとうございます。社内で慎重に協議した結果、利用規約違反が確認されたため、「${item.name}」を削除しました。削除理由は以下の通りです。「${deleteReason}」。今後とも利用規約に沿ったご利用をお願いいたします。`,
        }, { transaction: t });

        await item.ParentDelivery.destroy({ transaction: t });

        const deliveryBefore = await Delivery.findAll({
            attributes: ['id', 'paid_info_id'],
            where: {
                item_id: item.id,
                seller_user_id: item.seller_id,
                parent_data: false,
                cancel: false,
                buy_date: { [Op.not]: null },
                delivery_status_id: 1,
            },
            include: [
                {
                    model: PaidInfo,
                    attributes: ['id', 'price', 'payment_method_id', 'item_count'],
                    include: [
                        {
                            model: PaymentMethodOption,
                        },
                        {
                            model: Cancel,
                        }
                    ]
                }
            ]
        });

        const deleteOrder = [];

        if (deliveryBefore && deliveryBefore.length > 0) {
            for (const delivery of deliveryBefore) {
                await delivery.update({
                    cancel: true,
                }, { transaction: t });

                await delivery.PaidInfo.update({
                    cancel: true,
                }, { transaction: t });

                await delivery.PaidInfo.Cancel.upsert({
                    cancel_reason: "商品削除",
                    return_amount: delivery.PaidInfo.price,
                    item_count: delivery.PaidInfo.item_count,
                    cancel_flag: true,
                    paid_info_id: delivery.PaidInfo.id,
                }, { transaction: t });

                deleteOrder.push({
                    paid_id: delivery.paid_info_id,
                    delivery_id: delivery.id,
                    cancel_reason: "商品削除",
                    refund_status: "未返金",
                    refund_method: delivery.PaidInfo.PaymentMethodOption.name,
                    refund_amount: delivery.PaidInfo.price,
                    deleted_by: adminId,
                });
            }

            await DeletedOrderSystems.bulkCreate(deleteOrder, { transaction: t });
        }

        let newImages = [];
        if (item.image_url && item.image_url.length > 0) {
            newImages = await Promise.all(
                item.image_url.map((url: string) => moveToGlacier(url, sellerId))
            )
        }

        let newVideoUrl = null;
        let newThumbnailUrl = null;
        if (item.Video) {
            const videoUrl = item.Video.converted_url || item.Video.original_url;
            if (videoUrl) {
                newVideoUrl = await moveToGlacier(videoUrl, sellerId);
            }

            if (item.Video.thumbnail_url) {
                newThumbnailUrl = await moveToGlacier(item.Video.thumbnail_url, sellerId);
            }
        }

        await DeletedItems.create({
            item_id: item.id,
            seller_id: item.seller_id,
            item_name: item.name,
            explain: item.explain,
            price: item.price,
            image_url: newImages,
            video_url: newVideoUrl,
            thumbnail_url: newThumbnailUrl,
            video_title: item.Video ? item.Video.title : null,
            video_summary: item.Video ? item.Video.summary : null,
            parent_delivery_id: item.ParentDelivery ? item.ParentDelivery.id : null,
            delete_reason: "強制削除",
            deleted_by: adminId,
        }, { transaction: t });

        await ItemDeleteLogs.create({
            item_id: item.id,
            delete_user_id: adminId,
            delete_by_admin: true,
            delete_reason: "強制削除",
        }, { transaction: t });

        await item.destroy({ transaction: t });

        await t.commit();
        return { success: true };

    } catch (err) {
        await t.rollback();
        throw err;
    }
}

export default adminDeleteItem;