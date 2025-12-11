import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { ShopInfoEdit, ComOrFreeOption, Address, Name, TodouhukenOption, ShopInfo, User } from "../models/index.js";

const router = Router();

router.patch("/phone-number-edit/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;
    const userId = req.user!.id;
    const phoneNumber = req.body.phoneNumber;
    if (!phoneNumber) {
        res.status(400).json({ message: "電話番号がありません。" });
        return;
    }

    try {
        await ShopInfo.update({
            phone_number: phoneNumber,
        }, { where: { id: shopId }});

        await User.update({
            phone_number: phoneNumber,
        }, { where: { id: userId }});

        res.status(200).json({ message: "電話番号を更新しました。" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/address/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;
    
    try {
        const data = await Address.findOne({
            attributes: ["id", "todouhuken_id", "shikutyouson", "banchi", "building"],
            where: { shop_info_id: shopId },
            include: [
                {
                    model: TodouhukenOption,
                    as: "AddressToduhuken",
                },
            ],
        });

        if (!data) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/phone-number/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;

    try {
        const data = await ShopInfo.findByPk(shopId, {
            attributes: ["id", "phone_number"],
        });

        if (!data) {
            res.status(404).json({ message: "データが見つかりません。"});
            return;
        }

        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/rep-name/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;

    try {
        const shop = await ShopInfo.findByPk(shopId, {
            attributes: ["id"],
            include: [
                {
                    model: Name,
                    as: "RepresentativeName",
                    attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                }
            ]
        });

        if (!shop) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        res.status(200).json({ name: shop.RepresentativeName });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/con-name/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;

    try {
        const shop = await ShopInfo.findByPk(shopId, {
            attributes: ["id"],
            include: [
                {
                    model: Name,
                    as: "ContactName",
                    attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                }
            ]
        });

        if (!shop) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        res.status(200).json({ name: shop.ContactName });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/admin/list', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const dataList = await ShopInfoEdit.findAll({
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: ComOrFreeOption,
                    attributes: ['id', 'name']
                },
                {
                    model: Address,
                    attributes: ['id', 'post_number', 'shikutyouson', 'banchi', 'building'],
                    include: [
                        {
                            model: TodouhukenOption,
                            as: 'AddressTodouhuken',
                            attributes: ['id', 'name']
                        }
                    ]
                },
                {
                    model: Name,
                    attributes: ['id', 'sei', 'mei', 'sei_kana', 'mei_kana', 'middle_name', 'middle_name_kana']
                }
            ]
        });

        if (!dataList) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        res.json(dataList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;