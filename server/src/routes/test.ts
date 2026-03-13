import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Address, Brands, Cancel, Cart, Categories, Chat, Delivery, GoodItem, Item, ItemDeleteLogs, Name, PaidInfo, Sale, User, WatchHistory } from "../models/index.js";
import sequelize from "../db.js";
import { Op } from "sequelize";
import crypto from "crypto";

const router = Router();

const now = Date.now();
const nowDate = new Date();

router.patch("/item-date/:id", async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;

    try {
        if (!itemId) {
            throw new Error("NOT_FOUND");
        }

        const item = await Item.findByPk(itemId);

        if (!item) {
            throw new Error("NOT_FOUND");
        }

        await item.update({
            uploaded_at: nowDate,
            save_at: nowDate,
        });

        res.status(201).json({ message: `ok! ${nowDate}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "COPY_FAILED" });
    }
});

router.post("/item-copy/:id", async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;

    try {
        if (!itemId) {
            throw new Error("NOT_FOUND");
        }

        const item = await Item.findByPk(itemId);

        if (!item) {
            throw new Error("NOT_FOUND");
        }

        const itemData = item.get({ plain: true });

        delete itemData.id;
        delete itemData.createdAt;
        delete itemData.updatedAt;

        const copies = Array.from({ length: 100 }, () => ({
            ...itemData,
        }));

        await Item.bulkCreate(copies);

        res.status(201).json({ message: "100 items copied 🌱" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "COPY_FAILED" });
    }
});

router.patch("/status-sold", async (req: Request, res: Response): Promise<void> => {
    const t = await sequelize.transaction();
    try {
        const items = await Item.findAll({
            where: {
                id: { [Op.gt]: 50 }
            }
        });

        if (items.length === 0) {
            throw new Error("NOT_FOUND");
        }

        await Promise.all(items.map(async(item: typeof Item) => {
            await item.update({
                status: "soldout",
            }, { transaction: t });
        }));

        await t.commit();

        res.status(201).json({ message: "status changed" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: "COPY_FAILED" });
    }
});

router.post("/cart-create/:id", async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id);

    const t = await sequelize.transaction();

    try {
        if (!Number.isInteger(userId) || userId <= 0) {
            throw new Error("INVALID_USER_ID");
        }

        const items = await Item.findAll({
            where: {
                seller_id: { [Op.ne]: userId },
                status: "active",
            },
        });

        await Cart.bulkCreate(
            items.map((item: any) => ({
                item_id: item.id,
                addtocart_user_id: userId,
            })),
            { transaction: t }
        );

        await t.commit();

        res.status(201).json({ message: "cart created" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: "FAILED" });
    }
});

router.post("/sale-create", async (req: Request, res: Response): Promise<void> => {
    const t = await sequelize.transaction();

    try {
        const items = await Item.findAll({
            where: {
                id: { [Op.gt]: 45 },
            },
        });

        if (items.length === 0) {
            throw new Error("NOT_FOUND");
        }

        for (const item of items) {
            await Sale.create({
                item_id: item.id,
                before_price: item.price,
                sale_flag: true,
                discount_rate: 10,
            }, { transaction: t });

            await item.update({
                price: item.price * 0.9,
            }, { transaction: t });
        }

        await t.commit();

        res.status(201).json({ message: "ok" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラー" });
    }
});

router.post("/name-create/:id", async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id);

    try {
        if (!Number.isInteger(userId) || userId <= 0) {
            throw new Error("INVALID_USER_ID");
        }

        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Name,
                    required: false,
                },
            ],
        });

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        await user.Name.upsert({
            sei: "Russel",
            mei: "George",
            sei_kana: "ラッセル",
            mei_kana: "ジョージ",
            user_id: user.id,
        });

        res.status(201).json({ message: "ok" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラー" });
    }
});

router.post("/address-create/:id", async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id);

    try {
        if (!Number.isInteger(userId) || userId <= 0) {
            throw new Error("INVALID_USER_ID");
        }

        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Address,
                    required: false,
                },
            ],
        });

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        await user.Address.upsert({
            post_number: "2100007",
            todouhuken_id: 14,
            shikutyouson: "川崎市川崎区",
            banchi: "駅前本町11-2",
            building: "川崎フロンティアビル4F",
            user_id: user.id,
        });

        res.status(201).json({ message: "ok" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラー" });
    }
});

function generatePayId(): string {
    return crypto.randomBytes(16).toString("base64url");
}

router.post("/paid-create/:id", async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id);

    const t = await sequelize.transaction();

    try {
        if (!Number.isInteger(userId) || userId <= 0) {
            throw new Error("INVALID_USER_ID");
        }

        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        const items = await Item.findAll({
            where: {
                seller_id: { [Op.ne]: userId },
            },
            include: [
                {
                    model: Categories,
                    as: "Category",
                },
                {
                    model: Brands,
                    as: "Brand",
                    required: false,
                },
                {
                    model: User
                },
            ],
        });

        if (items.length === 0) {
            throw new Error("NOT_FOUND");
        }

        // PaidInfo.bulkCreate
        const paidInfos = await PaidInfo.bulkCreate(
            items.map((item: any) => ({
                unit_price: item.price,
                item_count: 3,
                subtotal_amount: item.price * 3,
                discount_amount: 0,
                total_amount: item.price * 3,
                point_used: 0,
                paid_amount: item.price * 3,
                sales_commission_amount: Math.floor((item.price * 3) * 0.1),
                gain_amount: Math.floor((item.price * 3) * 0.9),
                payment_method_id: 1,
                item_id: item.id,
                seller_user_id: item.seller_id,
                buyer_user_id: userId,
                buy_at: new Date(),
                paid_at: new Date(),
                pay_id: generatePayId(),
                status: "paid",
                purchase_snapshot: {
                    item_id: item.id,
                    item_name: item.name,
                    item_image: item.first_image_url,

                    category: {
                        id: item.Category.id,
                        name: item.Category.name,
                    },

                    brand: {
                        id: item.Brand?.id ?? undefined,
                        name: item.Brand?.name ?? undefined,
                    },

                    materials: item.attributes.materials ?? [],
                },
            })),
            { transaction: t },
        );

        // Delivery.bulkCreate
        await Delivery.bulkCreate(
            paidInfos.map((paid: any, index: number) => ({
                buyer_phone_number: user.phone_number,
                cancel: false,
                shipping_day_id: 1,
                shipping_service_id: 1,
                delivery_status_id: 1,
                shipping_place_id: 11,
                paid_info_id: paid.id,
                shipping_at: null,
                arrived_at: null,
                arrive_specified_date: now,
                shipping_service_free_text: "テストテストテスト",
                shipping_from_name: `
                ${items[index].User.Name?.sei ?? "NO_NAME"} 
                ${items[index].User.Name?.mei ?? "NO_NAME"}
                `,
                shipping_from_postcode: items[index].User.Address?.post_number ?? "NO_ADDRESS",
                shipping_from_prefecture: items[index].User.Address?.todouhuken_id ?? 14,
                shipping_from_address_line1: `
                ${items[index].User.Address?.shikutyouson ?? "NO_ADDRESS"}
                ${items[index].User.Address?.banchi ?? "NO_ADDRESS"}
                `,
                shipping_from_address_line2: items[index].User.Address?.building ?? null,
                shipping_from_phone: items[index].User.phone_number,
                tracking_number: null,
                shipping_memo: "テキストテキストテキストテキスト",
            })),
            { transaction: t },
        );

        // Cancel.bulkCreate
        await Cancel.bulkCreate(
            paidInfos.map((paid: any) => ({
                paid_info_id: paid.id
            })),
            { transaction: t },
        );

        await t.commit();

        res.status(201).json({ message: "created" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: "FAILED" });
    }
});

router.patch("/paid-patch/:id", async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id);

    const t = await sequelize.transaction();

    try {
        if (!Number.isInteger(userId) || userId <= 0) {
            throw new Error("INVALID_USER_ID");
        }

        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        const paidInfos = await PaidInfo.findAll({
            where: {
                buyer_user_id: userId,
            },
            include: [
                {
                    model: Item,
                    include: [
                        {
                            model: Categories,
                             as: "Category",
                        },
                        {
                             model: Brands,
                               as: "Brand",
                              required: false,
                        },
                        {
                            model: User
                        },
                    ],
                },
            ],
        });

        const now = new Date();

        await Promise.all(paidInfos.map(async (paid: any) => {
            await paid.update({
                purchase_snapshot: {
                    item_id: paid.Item.id,
                    item_name: paid.Item.name,
                    item_image: paid.Item.first_image_url,

                    category: {
                        id: paid.Item.Category?.id ?? "",
                        name: paid.Item.Category?.name ?? "",
                    },

                    brand: {
                        id: paid.Item.Brand?.id ?? undefined,
                        name: paid.Item.Brand?.name ?? undefined,
                    },

                    materials: paid.Item.attributes.materials ?? [],
                },
            }, { transaction: t });
        }));

        await t.commit();

        res.status(200).json({ message: "ok" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: "FAILED" });
    }
});

export default router;