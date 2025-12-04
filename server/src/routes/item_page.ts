import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateToken, authenticateOptional } from "../middleware/index.js";
import { Item, User, ItemConditionOption, Cart, GoodItem, Video, Sale, Delivery, ShippingDayOption, ShippingServiceOption, TodouhukenOption, ShopInfo, ReccomendItem, ColorSize, SizeOption, SizeWearOption, SizeShoesOption, Category, WatchHistory, Address, Name, Comment, Notification, ItemDeleteLogs } from "../models/index.js";
import sequelize from "../db.js";
import itemCopyUpload from "../services/itemCopyUpload.js";

const router = Router();

router.post('/access-normal/:id', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    if (!itemId) {
        res.status(400).json({ message: '商品のidがありません。' });
        return;
    }
    const currentUserId = req.user?.id ?? null;

    try {
        const item = await Item.findByPk(itemId, {
            include: [{ model: ReccomendItem }],
        });
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
                
                if (item.ReccomendItem) {
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

router.post('/sort-add/:id', async (req: Request, res: Response): Promise<void> => {
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
    const itemId = req.params.id;
    if (!itemId) {
        res.status(400).json({ message: 'itemIdがありません。' });
        return;
    }

    try {
        const user = await User.findByPk(req.user!.id);
        if (!user) {
            res.status(404).json({ message: "ユーザーが見つかりません。" });
            return;
        }
        
        const item = await Item.findByPk(itemId, {
            include: [
                {
                    model: Delivery,
                    as: 'ParentDelivery'
                }
            ]
        });
        if (!item) {
            res.status(404).json({ message: '商品が見つかりません。' });
            return;
        }

        const newDelivery = await Delivery.create({
            buyer_phone_number: user.phone_number,
            shipping_day_id: item.ParentDelivery.shipping_day_id,
            shipping_service_id: item.ParentDelivery.shipping_service_id,
            delivery_status_id: 1,
            shipping_place_id: item.ParentDelivery.shipping_place_id,
            parent_data_id: item.ParentDelivery.id,
            item_id: itemId,
            seller_user_id: item.seller_id,
            buyer_user_id: user.id,
        });

        const userAddress = await Address.findOne({
            where: { user_id: user.id },
        });

        const newAddress = await Address.create({
            delivery_id: newDelivery.id,
        });

        if (userAddress) {
            await newAddress.update({
                post_number: userAddress.post_number,
                todouhuken_id: userAddress.todouhuken_id,
                shikutyouson: userAddress.shikutyouson,
                banchi: userAddress.banchi,
                building: userAddress.building,
            });
        }

        const userName = await Name.findOne({
            where: { user_id: user.id },
        });

        const newName = await Name.create({
            delivery_id: newDelivery.id,
        });

        if (userName) {
            await newName.update({
                sei: userName.sei,
                mei: userName.mei,
                sei_kana: userName.sei_kana,
                mei_kana: userName.mei_kana,
            });
        }

        res.status(200).json({ deliveryId: newDelivery.id });
    } catch (err) {
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

router.post('/delete-item-user/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    const userId = req.user!.id;

    const deliveryNow = await Delivery.findAll({
        where: {
            item_id: itemId,
            seller_user_id: userId,
            parent_data: false,
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
            ]
        });

        await Comment.destroy({ where: { item_id: itemId }, transaction: t });
        await GoodItem.destroy({ where: { item_id: itemId }, transaction: t });
        await Cart.destroy({ where: { item_id: itemId }, transaction: t });

        const updateItemData = {
            uploaded_date: null,
            sort_number: 0,
            public: false,
            deleted: true,
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

router.post('/perfect-delete/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;

    const item = await Item.findByPk(itemId, {
        include: [
            {
                model: Delivery,
                as: "ParentDelivery",
            },
        ],
    });
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

        if (item.ParentDelivery) {
            await item.ParentDelivery.destroy({ transaction: t });
        }

        await item.destroy({ transaction: t });

        await t.commit();
        res.status(200).json({ message: "商品削除が完了しました。" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.post("/restore-item/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    const userId = req.user!.id;

    const now = Date.now();

    try {
        const item = await Item.findByPk(itemId);

        await item.update({
            uploaded_date: now,
            public: true,
            deleted: false,
            deleted_at: null,
        });

        await Notification.create({
            read_user_id: userId,
            url: `/item/${itemId}`,
            message_image: item.first_image_url,
            message: `「${item.name}」を復元しました。こちらから復元した商品を確認できます。`
        });

        res.status(200).json({ message: "商品を復元しました。" });
    } catch (err) {
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
                    attributes: ['title', 'summary']
                }
            ]
        });

        if (!item) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        res.json(item);
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
                exclude: ['sort_number', 'views_count', 'views_24h', 'checked', 'createdAt', 'search_text']
            },
            include: [
                { model: ItemConditionOption, attributes: ['name'] },
                {
                    model: Video,
                    attributes: ['id', 'thumbnail_url', 'title', 'summary', 'duration', 'play_count', 'original_url', 'converted_url'],
                },
                {
                    model: Sale,
                    attributes: ['id', 'before_price', 'discount_rate', 'discount_amount', 'sale_flag'],
                },
                {
                    model: Delivery,
                    as: 'ParentDelivery',
                    attributes: ['id', 'parent_data'],
                    where: { parent_data: true },
                    required: false,
                    include: [
                        {
                            model: ShippingDayOption,
                            attributes: ['name']
                        },
                        {
                            model: ShippingServiceOption,
                            attributes: ['name']
                        },
                        {
                            model: TodouhukenOption,
                            as: 'DeliveryTodouhuken',
                            attributes: ['name']
                        }
                    ],
                },
                {
                    model: ColorSize,
                    attributes: ['kind', 'color', 'size', 'image_url', 'stock_all', 'stock_now'],
                    include: [
                        {
                            model: SizeOption,
                            attributes: ['name']
                        },
                        {
                            model: SizeShoesOption,
                            attributes: ['name']
                        },
                        {
                            model: SizeWearOption,
                            attributes: ['name']
                        }
                    ]
                },
            ]
        });

        if (!item
            || item.public
            || (page === "draft" && (!item.draft || item.deleted))
            || (page === "confirm" && item.deleted)
            || (page === "deleted" && !item.deleted)
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
                exclude: ['sort_number', 'views_count', 'views_24h', 'checked', 'createdAt', 'search_text']
            },
            include: [
                { model: ItemConditionOption, attributes: ['name'] },
                {
                    model: User,
                    attributes: ['id', 'user_name', 'profile_image', 'early_seller', 'honnin_verified', 'star_amount', 'star_average'],
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id']
                        }
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
                    model: Delivery,
                    as: 'ParentDelivery',
                    attributes: ['id', 'parent_data'],
                    where: { parent_data: true },
                    required: false,
                    include: [
                        {
                            model: ShippingDayOption,
                            attributes: ['name']
                        },
                        {
                            model: ShippingServiceOption,
                            attributes: ['name']
                        },
                        {
                            model: TodouhukenOption,
                            as: 'DeliveryTodouhuken',
                            attributes: ['name']
                        }
                    ],
                },
                {
                    model: ReccomendItem,
                    attributes: ['id']
                },
                {
                    model: ColorSize,
                    attributes: ['kind', 'color', 'size', 'image_url', 'stock_all', 'stock_now'],
                    include: [
                        {
                            model: SizeOption,
                            attributes: ['name']
                        },
                        {
                            model: SizeShoesOption,
                            attributes: ['name']
                        },
                        {
                            model: SizeWearOption,
                            attributes: ['name']
                        }
                    ]
                },
                {
                    model: Category,
                    attributes: ['id', 'category1_id'],
                },
            ]
        });

        if (!item || !item.public || item.deleted || item.not_finish || item.draft) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const sellerMe = currentUserId === item.seller_id;

        const goodCount = await GoodItem.count({
            where: { item_id: itemId },
        });
        
        const isGood = await GoodItem.findOne({
            where: {
                good_user_id: currentUserId,
                item_id: itemId,
            },
        });
        const isGoodByMe = !!isGood;

        const commentCount = await Comment.count({
            where: { item_id: itemId },
        });

        const itemList = await Item.findAll({
            where: {
                id: { [Op.ne]: itemId },
                public: true,
                sold_out: false,
                deleted: false,
                ...(currentUserId
                    ? (
                        sellerMe
                        ? { seller_id: currentUserId }
                        : { 
                            '$Category.category1_id$': item.Category.category1_id,
                            seller_id: { [Op.ne]: currentUserId } 
                        }
                    )
                    : {
                        '$Category.category1_id$': item.Category.category1_id,
                    }
                )
            },
            order: [['sort_number', 'DESC']],
            limit: 20,
            attributes: ['id', 'name', 'price', 'first_image_url'],
            include: [
                {
                    model: Sale,
                    attributes: ['discount_rate', 'discount_amount', 'sale_flag'],
                    required: false
                },
                {
                    model: Category,
                    attributes: ['id', 'category1_id'],
                }
            ]
        });

        res.json({ item, sellerMe, goodCount, isGoodByMe, commentCount, itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;