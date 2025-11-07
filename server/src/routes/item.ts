import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/index.js";
import { Item, User, ItemConditionOption, Video, Delivery, ShippingDayOption, ShippingServiceOption, TodouhukenOption, ItemCategory1Option, CategoryCampOption, CategoryHikeOption, CategoryWearOption, CategoryOtherOption, Category, ReccomendMonth, ItemDeleteLogs } from "../models/index.js";
import sequelize from "../db.js";

const router = Router();

router.post('/delete-all', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const items = await Item.findAll({
        where: {
            seller_id: userId,
            public: false,
            deleted: true,
        },
        include: [
            {
                model: Delivery,
                as: "ParentDelivery",
            },
        ],
    });
    if (!items || items.length === 0) {
        res.status(404).json({ message: "削除する商品データが見つかりません。" });
        return;
    }

    const t = await sequelize.transaction();

    try {
        const newItemDeleteLogs = [];
        for (const item of items) {
            newItemDeleteLogs.push({
                item_id: item.id,
                delete_user_id: item.seller_id,
                delete_by_admin: false,
                delete_reason: "自主削除",
            });

            if (item.ParentDelivery) {
                await item.ParentDelivery.destroy({ transaction: t });
            }

            await item.destroy({ transaction: t });
        }

        await ItemDeleteLogs.bulkCreate(newItemDeleteLogs, { transaction: t });

        await t.commit();
        res.status(200).json({ message: "商品削除が完了しました。" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/upload-image-list/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const imageList = await Item.findByPk(req.params.id, {
            attributes: ['image_url']
        });

        if (!imageList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(imageList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/upload-options', async (req: Request, res: Response): Promise<void> => {
    try {
        const category1 = await ItemCategory1Option.findAll();
        const categoryCamp = await CategoryCampOption.findAll();
        const categoryHike = await CategoryHikeOption.findAll();
        const categoryWear = await CategoryWearOption.findAll();
        const categoryOther = await CategoryOtherOption.findAll();
        const itemCondition = await ItemConditionOption.findAll();
        const shippingService = await ShippingServiceOption.findAll();
        const todouhuken = await TodouhukenOption.findAll();
        const shippingDay = await ShippingDayOption.findAll();

        res.json({
            category1,
            categoryCamp,
            categoryHike,
            categoryWear,
            categoryOther,
            itemCondition,
            shippingService,
            todouhuken,
            shippingDay
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/upload/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await Item.findByPk(req.params.id, {
            attributes: ['id', 'name', 'price', 'explain', 'image_url', 'sold_out', 'stock_all', 'stock_now', 'public'],
            include: [
                {
                    model: Video,
                    attributes: ['id', 'video_url', 'thumbnail_url', 'title', 'summary', 'duration']
                },
                {
                    model: Delivery,
                    where: { parent_data: true },
                    attributes: ['id'],
                    required: false,
                    include: [
                        {
                            model: ShippingDayOption,
                            attributes: ['id','name']
                        },
                        {
                            model: ShippingServiceOption,
                            attributes: ['id','name']
                        },
                        {
                            model:TodouhukenOption,
                            as: 'DeliveryTodouhuken',
                            attributes: ['id','name']
                        }
                    ]
                },
                {
                    model: ItemConditionOption,
                    attributes: ['id', 'name']
                },
                {
                    model: Category,
                    attributes: ['id'],
                    include: [
                        {
                            model: ItemCategory1Option,
                            attributes: ['id', 'name']
                        },
                        {
                            model: CategoryCampOption,
                            attributes: ['id', 'name']
                        },
                        {
                            model: CategoryHikeOption,
                            attributes: ['id', 'name']
                        },
                        {
                            model: CategoryWearOption,
                            attributes: ['id', 'name']
                        },
                        {
                            model: CategoryOtherOption,
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        if (!item) {
            res.status(404).json({ error: 'アイテムが見つかりません。' });
            return;
        }
        
        const category1 = await ItemCategory1Option.findAll();
        const categoryCamp = await CategoryCampOption.findAll();
        const categoryHike = await CategoryHikeOption.findAll();
        const categoryWear = await CategoryWearOption.findAll();
        const categoryOther = await CategoryOtherOption.findAll();
        const itemCondition = await ItemConditionOption.findAll();
        const shippingService = await ShippingServiceOption.findAll();
        const todouhuken = await TodouhukenOption.findAll();
        const shippingDay = await ShippingDayOption.findAll();

        res.json({
            item,
            category1,
            categoryCamp,
            categoryHike,
            categoryWear,
            categoryOther,
            itemCondition,
            shippingService,
            todouhuken,
            shippingDay
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/upload-ok/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const currentUserId = req.user!.id;

        const item = await Item.findByPk(req.params.id, {
            attributes: ['id', 'name', 'price', 'stock_all', 'first_image_url'],
        });

        if (!item) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const currentUserReccomend = await User.findOne({
            attributes: ['id'],
            where: { id: currentUserId },
            include: [
                {
                    model: ReccomendMonth,
                    attributes: ['id']
                }
            ]
        });

        res.json({
            item,
            currentUserReccomend
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;