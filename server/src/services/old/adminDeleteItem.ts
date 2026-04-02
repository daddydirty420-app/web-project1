import { Op } from "sequelize";
import { Item, Video, Delivery, ItemDeleteLogs, Sale, Notification, ItemDeleted, Orders, PaymentMethodOption, Cancel, OrderDeleted, ItemShippingProfile, User, BankAccount, Transfer } from "../../models/index.js";
import sequelize from "../../db.js";
import moveToGlacier from "./moveToGlacier.js";
import crypto from "crypto";

async function adminDeleteItem(itemId: number, adminId: number, deleteReason: string) {
    const today = new Date();

    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);

    const dayOfWeek = twoWeeksLater.getDay();
    const dayUntilFriday = (5 - dayOfWeek + 7) % 7;
    twoWeeksLater.setDate(twoWeeksLater.getDate() + dayUntilFriday);

    const t = await sequelize.transaction();

    try {
        const item = await Item.findByPk(itemId, {
            include: [
                { model: Sale },
                { model: Video },
                { model: ItemShippingProfile },
            ],
        });

        const sellerId = item.seller_id;

        await Notification.create({
            read_user_id: sellerId,
            url: `/profile/${sellerId}`,
            message: `平素より〇〇をご利用いただき誠にありがとうございます。社内で慎重に協議した結果、利用規約違反が確認されたため、「${item.name}」を削除しました。削除理由は以下の通りです。「${deleteReason}」。今後とも利用規約に沿ったご利用をお願いいたします。`,
        }, { transaction: t });

        const orders = await Orders.findAll({
            where: {
                item_id: item.id,
                status: { [Op.notIn]: ["cancelled", "returned"] },
            },
            include: [
                {
                    model: Delivery,
                    where: {
                        cancel: false,
                        delivery_status_id: 1,
                    },
                    required: true,
                },
            ],
        });

        const deleteOrder = [];

        if (orders && orders.length > 0) {
            for (const order of orders) {
                await order.update({
                    status: "cancelled",
                }, { transaction: t });

                await order.Delivery.update({
                    cancel: true,
                }, { transaction: t });

                await Cancel.upsert({
                    orders_id: order.id,
                    cancel_reason: "商品削除",
                    return_amount: order.total_amount,
                    item_count: order.item_count,
                    cancel_flag: true,
                    cancel_fee_return_id: 2,
                }, { transaction: t });

                const buyer = await User.findByPk(order.buyer_user_id, {
                    include: [
                        { model: BankAccount },
                    ],
                });

                const buyerHasAccount = !!buyer.BankAccount;

                await Notification.create({
                    read_user_id: buyer.id,
                    message_image: item.first_image_url,
                    message: `[重要] 取引中の商品「${item.name}」は利用規約違反により削除され、取引はキャンセル・返金となりました。` +
                        `購入費用は全額お客様の口座に返金されます。なお、お振込日は本日から翌々週の金曜日以降となります。ご迷惑をおかけいたしますが、ご対応のほどよろしくお願いします。` +
                        `${buyerHasAccount ? "口座情報が未登録です。至急口座を登録してください。30日以内に登録がない場合、返金できませんのでご注意ください。" : ""}`,
                }, { transaction: t });

                const transferId = crypto.randomBytes(11).toString("hex");
                    
                await Transfer.create({
                    all_money: order.total_amount,
                    handling_charge: 0,
                    trans_money: order.total_amount,
                    trans_reason_id: 2,
                    trans_schedule_date: twoWeeksLater,
                    user_id: buyer.id,
                    transfer_id: transferId,
                }, { transaction: t });

                deleteOrder.push({
                    orders_id: order.id,
                    delivery_id: order.Delivery.id,
                    cancel_reason: "商品削除",
                    refund_status: "未返金",
                    refund_method: "口座振込",
                    refund_amount: order.total_amount,
                    deleted_by: adminId,
                });

                // メール送信処理
            }

            await OrderDeleted.bulkCreate(deleteOrder, { transaction: t });
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

        await ItemDeleted.create({
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
};

export default adminDeleteItem;