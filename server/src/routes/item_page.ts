import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateToken, authenticateOptional } from "../middleware/index.js";
import { Item, User, ItemConditionOption, Cart, ItemLike, Video, Sale, Delivery, ShippingDayOption, ShippingServiceOption, TodouhukenOption, ShopInfo, WatchHistory, Address, Name, Comment, Notification, ItemDeleteLogs, ItemShippingProfile, Categories, Brands } from "../models/index.js";
import sequelize from "../db.js";
import itemCopyUpload from "../services/itemCopyUpload.js";

const router = Router();

router.patch('/access-normal/:id', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    if (!itemId) {
        res.status(400).json({ message: '商品のidがありません。' });
        return;
    }
    const currentUserId = req.user?.id ?? null;

    try {
        const item = await Item.findByPk(itemId);
        if (!item) {
            res.status(404).json({ message: '商品が見つかりません。' });
            return;
        }

        const history = await WatchHistory.findOne({
            where: {
                item_id: itemId,
                user_id: currentUserId,
            },
        });

        if (history) {
            history.updatedAt = new Date();
            await history.save();
        } else {
            await WatchHistory.create({
                item_id: itemId,
                user_id: currentUserId || null,
            });
        }

        if (item.seller_id !== currentUserId) {
            item.views_count += 1;

            if (!item.sold_out) {
                item.sort_number = Number(item.sort_number) + 5;
                item.sort_buzz_number = Number(item.sort_buzz_number) + 30;
                
                if (item.recommend) {
                    item.sort_number = Number(item.sort_number) + 5;
                    item.sort_buzz_number = Number(item.sort_buzz_number) + 30;
                }
            }

            await item.save();
        }

        res.status(200).json({ message: '商品ページアクセス処理が完了しました。' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.patch('/sort-add/:id', async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    if (!itemId) {
        res.status(400).json({ message: 'itemIdがありません。' });
        return;
    }

    const number = Number(req.query.number);
    const buzzNumber = number * 3;
    if (isNaN(number)) {
        res.status(400).json({ message: '数値が不正です。' });
        return;
    }

    try {
        const item = await Item.findByPk(itemId);
        if (!item) {
            res.status(404).json({ message: '商品が見つかりません。' });
            return;
        }

        if (!item.sold_out) {
            item.sort_number = Number(item.sort_number) + number;
            item.sort_buzz_number = Number(item.sort_buzz_number) + buzzNumber;
            await item.save();
        }

        res.status(200).json({ sortNumber: item.sort_number });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.post('/buy/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const itemId = req.params.id;
    if (!itemId) {
        res.status(400).json({ message: 'itemIdがありません。' });
        return;
    }

    const t = await sequelize.transaction();

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "ユーザーが見つかりません。" });
            return;
        }
        
        const item = await Item.findByPk(itemId, {
            include: [
                { model: ItemShippingProfile },
                {
                    model: User,
                    include: [
                        {
                            model: Address,
                            required: false,
                            include: [
                                {
                                    model: TodouhukenOption,
                                    as: "AddressTodouhuken",
                                },
                            ],
                        },
                        {
                            model: Name,
                            required: false,
                        },
                    ],
                },
            ],
        });

        if (!item) {
            res.status(404).json({ message: '商品が見つかりません。' });
            return;
        }

        if (item.status !== "active") {
            res.status(404).json({ message: "この商品は販売中ではないため購入できません" });
            return;
        }

        const newDelivery = await Delivery.create({
            buyer_phone_number: user.phone_number ?? "",
            shipping_day_id: item.ItemShippingProfile.shipping_day_id,
            shipping_service_id: item.ItemShippingProfile.shipping_service_id,
            delivery_status_id: 1,
            shipping_place_id: item.ItemShippingProfile.shipping_place_id,
            item_id: itemId,
            shipping_from_name: `${item.User.Name?.sei ?? ""} ${item.User.Name?.mei ?? ""}`,
            shipping_from_postcode: item.User.Address?.post_number ?? "",
            shipping_from_prefecture: item.User.Address?.AddressTodouhuken?.name ?? "",
            shipping_from_address_line1: `${item.User.Address?.shikutyouson ?? ""} ${item.User.Address?.banchi ?? ""}`,
            shipping_from_address_line2: item.User.Address?.building ?? "",
            shipping_from_phone: item.User.phone_number ?? "",
        }, { transaction: t });

        const userAddress = await Address.findOne({
            where: { user_id: userId },
        });

        const newAddress = await Address.create({
            delivery_id: newDelivery.id,
        }, { transaction: t });

        if (userAddress) {
            await newAddress.update({
                post_number: userAddress.post_number,
                todouhuken_id: userAddress.todouhuken_id,
                shikutyouson: userAddress.shikutyouson,
                banchi: userAddress.banchi,
                building: userAddress.building ?? "",
            }, { transaction: t });
        }

        const userName = await Name.findOne({
            where: { user_id: userId },
        });

        const newName = await Name.create({
            delivery_id: newDelivery.id,
        }, { transaction: t });

        if (userName) {
            await newName.update({
                sei: userName.sei,
                mei: userName.mei,
                sei_kana: userName.sei_kana,
                mei_kana: userName.mei_kana,
            }, { transaction: t });
        }

        await t.commit();

        res.status(200).json({ deliveryId: newDelivery.id });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.post('/copy-upload/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    if (!itemId) {
        res.status(400).json({ message: "itemIdがありません。" });
        return;
    }
    const userId = req.user!.id;

    try {
        const newItem = await itemCopyUpload(Number(itemId), userId);

        res.status(200).json({ newItemId: newItem.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.delete('/delete-item-user/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    const userId = req.user!.id;

    const deliveryNow = await Delivery.findAll({
        where: {
            cancel: false,
            buy_date: { [Op.not]: null },
            delivery_status_id: { [Op.ne]: 4 },
        },
    });
    if (deliveryNow && deliveryNow.length > 0) {
        res.status(400).json({ message: "取引中の商品は削除できません。" });
        return;
    }

    const now = Date.now();

    const t = await sequelize.transaction();
    try {
        const item = await Item.findByPk(itemId, {
            attributes: ['id', 'name', 'first_image_url'],
            include: [
                { model: Sale },
                { model: Video },
                { model: ItemShippingProfile },
            ],
        });

        await Comment.destroy({ where: { item_id: itemId }, transaction: t });
        await ItemLike.destroy({ where: { item_id: itemId }, transaction: t });
        await Cart.destroy({ where: { item_id: itemId }, transaction: t });

        const updateItemData = {
            uploaded_at: null,
            sort_number: 0,
            sort_buzz_number: 0,
            status: "deleted",
            deleted_at: now,
            price: item.price,
        };

        if (item.Sale && item.Sale.sale_flag) {
            await Sale.update({
                discount_rate: 0,
                discount_amount: 0,
                sale_flag: false,
            }, { 
                where: { item_id: itemId },
                transaction: t,
            });

            updateItemData.price = item.Sale.before_price;
        }

        await item.update(updateItemData, { transaction: t });

        await Notification.create({
            read_user_id: userId,
            url: `/item/deleted/${itemId}`,
            message_image: item.first_image_url,
            message: `${item.name}を削除しました。削除から1か月間はマイページの「削除した商品」、もしくはこのお知らせからアーカイブを確認・復元することができます。削除から1か月以上経過すると、アーカイブの確認・復元ができなくなりますのでご注意ください。`,
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ message: "商品を削除しました。" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.delete('/perfect-delete/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;

    const item = await Item.findByPk(itemId);
    if (!item) {
        res.status(404).json({ message: "削除する商品データが見つかりません。" });
        return;
    }

    const t = await sequelize.transaction();

    try {
        await ItemDeleteLogs.create({
            item_id: item.id,
            delete_user_id: item.seller_id,
            delete_by_admin: false,
            delete_reason: "自主削除",
        }, { transaction: t });

        await item.destroy({ transaction: t });

        await t.commit();
        res.status(200).json({ message: "商品削除が完了しました。" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.patch("/restore-item/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    const userId = req.user!.id;

    const now = Date.now();

    const t = await sequelize.transaction();

    try {
        const item = await Item.findByPk(itemId);

        await item.update({
            uploaded_at: now,
            status: "active",
            deleted_at: null,
        }, { transaction: t });

        await Notification.create({
            read_user_id: userId,
            url: `/item/${itemId}`,
            message_image: item.first_image_url,
            message: `「${item.name}」を復元しました。こちらから復元した商品を確認できます。`
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ message: "商品を復元しました。" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/metadata/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await Item.findByPk(req.params.id, {
            attributes: ['name', 'price', 'first_image_url'],
            include: [
                {
                    model: Video,
                    attributes: ['title', 'summary'],
                },
            ],
        });

        if (!item) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        res.json({ item });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get("/draft-confirm-deleted/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    const page = req.query.page;

    try {
        const item = await Item.findByPk(itemId, {
            attributes: {
                exclude: ['sort_number', 'views_count', 'checked', 'createdAt', 'search_text']
            },
            include: [
                { model: ItemConditionOption },
                {
                    model: Video,
                    attributes: ['id', 'thumbnail_url', 'title', 'summary', 'duration', 'play_count', 'original_url', 'converted_url'],
                },
                {
                    model: Sale,
                    attributes: ['id', 'before_price', 'discount_rate', 'discount_amount', 'sale_flag'],
                },
                {
                    model: ItemShippingProfile,
                    include: [
                        { model: ShippingDayOption },
                        { model: ShippingServiceOption },
                        { model: TodouhukenOption },
                    ],
                },
                {
                    model: Categories,
                    as: "Category",
                    include: [
                        {
                            model: Categories,
                            attributes: ["id", "name", "level", "parent_id", "allowed_gender", "allowed_age"],
                            as: "children",
                            required: false,
                        },
                        {
                            model: Categories,
                            attributes: ["id", "name", "level", "allowed_gender", "allowed_age"],
                            as: "parent",
                            required: false,
                        },
                    ],
                },
                {
                    model: Brands,
                    as: "Brand",
                    required: false,
                },
            ],
        });

        if (!item
            || item.status === "active"
            || (page === "draft" && !(item.status === "draft"))
            || (page === "confirm" && item.status === "deleted")
            || (page === "deleted" && !(item.status === "deleted"))
        ) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        res.status(200).json({ item });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/:id', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    const currentUserId = req.user?.id ?? null;

    try {
        const item = await Item.findByPk(itemId, {
            attributes: {
                exclude: ['sort_number', 'views_count', 'checked', 'createdAt', 'search_text'],
            },
            include: [
                { model: ItemConditionOption },
                {
                    model: User,
                    attributes: ['id', 'user_name', 'profile_image', 'early_seller', 'honnin_verified', 'star_amount', 'star_average'],
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id'],
                        },
                    ],
                },
                {
                    model: Video,
                    attributes: ['id', 'thumbnail_url', 'title', 'summary', 'duration', 'play_count', 'original_url', 'converted_url'],
                },
                {
                    model: Sale,
                    attributes: ['id', 'before_price', 'discount_rate', 'discount_amount', 'sale_flag'],
                },
                {
                    model: ItemShippingProfile,
                    include: [
                        { model: ShippingDayOption },
                        { model: ShippingServiceOption },
                        { model: TodouhukenOption },
                    ],
                },
                {
                    model: Categories,
                    as: "Category",
                    include: [
                        {
                            model: Categories,
                            attributes: ["id", "name", "level", "parent_id", "allowed_gender", "allowed_age"],
                            as: "children",
                            required: false,
                        },
                        {
                            model: Categories,
                            attributes: ["id", "name", "level", "allowed_gender", "allowed_age"],
                            as: "parent",
                            required: false,
                        },
                    ],
                },
                {
                    model: Brands,
                    as: "Brand",
                    required: false,
                },
            ],
        });

        if (!item || !(item.status === "active" || item.status === "soldout")) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const sellerMe = currentUserId === item.seller_id;

        const goodCount = await ItemLike.count({
            where: { item_id: itemId },
        });
        
        const isGood = await ItemLike.findOne({
            where: {
                user_id: currentUserId,
                item_id: itemId,
            },
        });
        const isGoodByMe = !!isGood;

        const commentCount = await Comment.count({
            where: { item_id: itemId },
        });

        let me = null;
        
        if (currentUserId) {
            me = await User.findByPk(currentUserId, {
                attributes: ["id", "user_name", "profile_image"],
            });
        }

        res.status(200).json({
            item,
            sellerMe,
            goodCount,
            isGoodByMe,
            commentCount,
            me
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;