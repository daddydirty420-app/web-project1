import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { ShopInfo, ComOrFreeOption, Address, Name, TodouhukenOption } from "../models/index.js";

const router = Router();

router.get("/com-or-free", async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await ComOrFreeOption.findAll();
        if (!data) {
            res.status(400).json({ message: "データが見つかりません。" });
            return;
        }

        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/has-shop/me', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
    try {
        const hasShop = await ShopInfo.findOne({
            where: {
                user_id: currentUserId,
                verified: true,
            }
        });

        if (!hasShop) {
            res.status(200).json({ hasShop: false });
            return;
        }

        res.status(200).json({ hasShop: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/edit-companyname/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await ShopInfo.findByPk(req.params.id, {
            attributes: ['id', 'company_name']
        });

        if (!data) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/edit-form/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await ShopInfo.findByPk(req.params.id, {
            attributes: ['id'],
            include: [
                {
                    model: ComOrFreeOption,
                    attributes: ['id', 'name']
                }
            ]
        });

        const allOptions = await ComOrFreeOption.findAll();

        if (!data || !allOptions) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({
            data: data,
            allOptions: allOptions
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/edit-other/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await ShopInfo.findByPk(req.params.id, {
            attributes: ['id', 'homepage_url', 'open_date_time', 'company_number', 'capital', 'menber_count', 'founded_date'],
        });

        if (!data) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/infopage/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await ShopInfo.findByPk(req.params.id, {
            attributes: ['id', 'company_name', 'shop_name', 'email', 'phone_number','homepage_url', 'open_date_time', 'open_info'],
            include: [
                {
                    model: Address,
                    attributes: ['post_number', 'shikutyouson', 'banchi', 'building'],
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
                    attributes: ['sei', 'mei', 'sei_kana', 'mei_kana', 'middle_name', 'middle_name_kana']
                }
            ]
        });

        if (!data) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/open-info-request/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await ShopInfo.findByPk(req.params.id, {
            attributes: ['id', 'shop_name']
        });

        if (!data) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;