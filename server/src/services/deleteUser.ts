import { Op } from "sequelize";
import bcrypt from "bcrypt";
import moveToGlacier from "./moveToGlacier.js";
import { User, UriagekinHistory, PointsHistory, PointsUriageOver, Journal, Transfar, UserDeleteLogs, ShopInfo, Address, Name, IdCard, BankAccount, Cart, Follow, GoodItem, GoodComment, ReferenceCode, Notification, WatchHistory, Comment, RecommendMonth, Item, Delivery, Video, DeletedItems, ItemDeleteLogs, DeletedOrderSystems, PaymentMethodOption, Cancel, PaidInfo } from "../models/index.js"
import sequelize from "../db.js";
import crypto from "crypto";

async function deleteUser(currentUserId: number, adminId: number, deleteReason: string): Promise<{ success: boolean}> {
    const t = await sequelize.transaction();
    
    try {
        const user = await User.findByPk(currentUserId);
        if (!user) throw new Error('ユーザーが見つかりません。');
    
        const uriagekinAll = user.uriagekin;
        const pointsAll = user.points;
    
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 180);
        
        let uriageRemaining = uriagekinAll;
        const uriageHistories = await UriagekinHistory.findAll({
            where: {
                user_id: currentUserId,
                createdAt: { [Op.gte]: cutoffDate }
            },
            order: [['createdAt', 'ASC']],
        });
    
        for (const history of uriageHistories) {
            if (uriageRemaining <= 0) break;
    
            const available = history.uriagekin - (history.used_uriagekin || 0);
            if (available > 0) {
                const deduction = Math.min(available, uriageRemaining);
                history.used_uriagekin = (history.used_uriagekin || 0) + deduction;
                uriageRemaining -= deduction;
                await history.save({ transaction: t });
            }
        }
    
        let pointsRemaining = pointsAll;
        const pointsHistories = await PointsHistory.findAll({
            where: {
                user_id: currentUserId,
                createdAt: { [Op.gte]: cutoffDate }
            },
            order: [['createdAt', 'ASC']],
        });
    
        for (const history of pointsHistories) {
            if (pointsRemaining <= 0) break;
    
            const available = history.points - (history.used_points || 0);
            if (available > 0) {
                const deduction = Math.min(available, pointsRemaining);
                history.used_points = (history.used_points || 0) + deduction;
                pointsRemaining -= deduction;
                await history.save({ transaction: t });
            }
        }
    
        await PointsUriageOver.create({
            points_confiscated: pointsAll,
            uriagekin_confiscated: uriagekinAll,
        }, { transaction: t });
    
        await Journal.create({
            kanjyo_kari1: 3,
            kanjyo_kashi1: 6,
            price_kari1: uriagekinAll,
            price_kashi1: uriagekinAll,
            reason_id: 8,
        }, { transaction: t });
    
        await Journal.create({
            kanjyo_kari1: 8,
            kanjyo_kashi1: 6,
            price_kari1: pointsAll,
            price_kashi1: pointsAll,
            reason_id: 9,
        }, { transaction: t });
    
        const transfarMoney = await Transfar.sum('trans_money', {
            where: {
                user_id: currentUserId,
                trans_finish: false
            }
        });
    
        await Journal.create({
            kanjyo_kari1: 3,
            kanjyo_kashi1: 6,
            price_kari1: transfarMoney,
            price_kashi1: transfarMoney,
            reason_id: 11,
        }, { transaction: t });
    
        await UserDeleteLogs.create({
            user_id: currentUserId,
            delete_reason: deleteReason,
            deleted_by_admin: true,
            admin_id: adminId,
        }, { transaction: t });
    
        // メール送信処理
    
        await ShopInfo.update({ user_id: null }, { where: { user_id: currentUserId }, transaction: t });
        await Address.update({ user_id: null }, { where: { user_id: currentUserId }, transaction: t });
        await Name.update({ user_id: null }, { where: { user_id: currentUserId }, transaction: t });
        
        await IdCard.destroy({ where: { user_id: currentUserId }, transaction: t });
        await BankAccount.destroy({ where: { user_id: currentUserId }, transaction: t });
        await Cart.destroy({ where: { addtocart_user_id: currentUserId }, transaction: t });
        await Follow.destroy({ where: { follow_user_id: currentUserId }, transaction: t });
        await Follow.destroy({ where: { follower_user_id: currentUserId }, transaction: t });
        await GoodComment.destroy({ where: { good_user_id: currentUserId }, transaction: t });
        await GoodItem.destroy({ where: { good_user_id: currentUserId }, transaction: t });
        await ReferenceCode.destroy({ where: { input_user_id: currentUserId }, transaction: t });
        await ReferenceCode.destroy({ where: { output_user_id: currentUserId }, transaction: t });
        await Notification.destroy({ where: { read_user_id: currentUserId }, transaction: t });
        await WatchHistory.destroy({ where: { user_id: currentUserId }, transaction: t });
        await Comment.destroy({ where: { user_id: currentUserId }, transaction: t });
        await RecommendMonth.destroy({ where: { user_id: currentUserId }, transaction: t });
        await Transfar.destroy({ where: { user_id: currentUserId }, transaction: t });
    
        const items = await Item.findAll({
            attributes: ['id', 'name', 'explain', 'image_url', 'price'],
            where: { seller_id: currentUserId },
            include: [
                { model: Video },
            ],
            transaction: t,
        });
    
        if (items.length > 0) {
            const deletedItemsData = [];
            const newItemDeleteLogs = [];
            for (const item of items) {
                const paidInfos = await PaidInfo.findAll({
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
                            required: false,
                        },
                    ],
                });

                if (paidInfos && paidInfos.length > 0) {
                    const today = new Date();

                    const twoWeeksLater = new Date(today);
                    twoWeeksLater.setDate(today.getDate() + 14);

                    const dayOfWeek = twoWeeksLater.getDay();
                    const dayUntilFriday = (5 - dayOfWeek + 7) % 7;
                    twoWeeksLater.setDate(twoWeeksLater.getDate() + dayUntilFriday);

                    const deleteOrder = [];

                    for (const paidInfo of paidInfos) {
                        await paidInfo.update({
                            status: "cancelled",
                        }, { transaction: t });

                        await paidInfo.Delivery.update({
                            cancel: true,
                        }, { transaction: t });

                        await Cancel.upsert({
                            paid_info_id: paidInfo.id,
                            cancel_reason: "商品削除",
                            return_amount: paidInfo.total_amount,
                            item_count: paidInfo.item_count,
                            cancel_flag: true,
                            cancel_fee_return_id: 2,
                        }, { transaction: t });

                        const buyer = await User.findByPk(paidInfo.buyer_user_id, {
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
                        
                        const transfarId = crypto.randomBytes(11).toString("hex");
                                            
                        await Transfar.create({
                            all_money: paidInfo.total_amount,
                            handling_charge: 0,
                            trans_money: paidInfo.total_amount,
                            trans_reason_id: 2,
                            trans_schedule_date: twoWeeksLater,
                            user_id: buyer.id,
                            transfar_id: transfarId,
                        }, { transaction: t });

                        deleteOrder.push({
                            paid_id: paidInfo.id,
                            delivery_id: paidInfo.Delivery.id,
                            cancel_reason: "出品者削除",
                            refund_status: "未返金",
                            refund_method: "口座振込",
                            refund_amount: paidInfo.total_amount,
                            deleted_by: adminId,
                        });

                        // メール送信処理
                    }

                    await DeletedOrderSystems.bulkCreate(deleteOrder, { transaction: t });
                }

                let newImages = [];
                if (item.image_url && item.image_url.length > 0) {
                    newImages = await Promise.all(
                        item.image_url.map((url: string) => moveToGlacier(url, currentUserId))
                    )
                }

                let newVideoUrl = null;
                let newThumbnailUrl = null;
                if (item.Video) {
                    const videoUrl = item.Video.converted_url || item.Video.original_url;
                    if (videoUrl) {
                        newVideoUrl = await moveToGlacier(videoUrl, currentUserId);
                    }

                    if (item.Video.thumbnail_url) {
                        newThumbnailUrl = await moveToGlacier(item.Video.thumbnail_url, currentUserId);
                    }
                }

                deletedItemsData.push({
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
                    delete_reason: "強制削除、ユーザー削除",
                    deleted_by: adminId,
                });

                newItemDeleteLogs.push({
                    item_id: item.id,
                    delete_user_id: adminId,
                    delete_by_admin: true,
                    delete_reason: "強制削除、ユーザー削除",
                });
            }

            await DeletedItems.bulkCreate(deletedItemsData, { transaction: t });
            await ItemDeleteLogs.bulkCreate(newItemDeleteLogs, { transaction: t });

            await items.destroy({ transaction: t });
        }
    
        const dummyPassword = `deleted${currentUserId}`;
        const hashedDummy = await bcrypt.hash(dummyPassword, 10);
    
        await user.update({
            user_name: '削除済みユーザー',
            user_introduction: null,
            profile_image: null,
            penalty_points: 0,
            early_seller: false,
            honnin_verified: false,
            email: `deleted-${currentUserId}@deleted.local`,
            campaign_points: 0,
            campaign_points_sum: 0,
            password: hashedDummy,
            points: 0,
            uriagekin: 0,
            star_amount: 0,
            star_average: 0,
            gender_id: null,
            birthday: null,
            phone_number: null,
            honnin_verify_request: false,
            email_verified: false,
        }, { transaction: t });

        await t.commit();
        return { success: true };

    } catch (err) {
        await t.rollback();
        throw err;
    }
}

export default deleteUser;