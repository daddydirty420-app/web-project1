import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { ColorSize, SizeOption, SizeWearOption, SizeShoesOption, Item } from "../models/index.js";

const router = Router();

router.get('/upload-color-size/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const itemId = req.params.id;

        const dataList = await ColorSize.findAll({
            attributes: ['id', 'kind', 'color', 'size', 'image_url', 'stock_all'],
            where: { item_id: itemId },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: SizeOption,
                    attributes: ['id', 'name']
                },
                {
                    model: SizeShoesOption,
                    attributes: ['id', 'name']
                },
                {
                    model: SizeWearOption,
                    attributes: ['id', 'name']
                },
                {
                    model: Item,
                    attributes: ['id', 'stock_all']
                }
            ]
        });

        if (!dataList) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        const totalStock = dataList.reduce((sum: number, data: InstanceType<typeof ColorSize>) => {
            return sum + (data.stock_all || 0);
        }, 0);

        const sizeOption = await SizeOption.findAll();
        const sizeWearOption = await SizeWearOption.findAll();
        const sizeShoesOption = await SizeShoesOption.findAll();

        res.json({
            dataList,
            totalStock,
            sizeOption,
            sizeWearOption,
            sizeShoesOption
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/upload-color-size-edit/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await ColorSize.findByPk(req.params.id, {
            attributes: ['id', 'kind', 'color', 'size', 'image_url', 'stock_all', 'stock_now'],
            include: [
                {
                    model: SizeOption,
                    attributes: ['id', 'name']
                },
                {
                    model: SizeShoesOption,
                    attributes: ['id', 'name']
                },
                {
                    model: SizeWearOption,
                    attributes: ['id', 'name']
                },
                {
                    model: Item,
                    attributes: ['id', 'stock_all']
                }
            ]
        });

        if (!data) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        const sizeOption = await SizeOption.findAll();
        const sizeWearOption = await SizeWearOption.findAll();
        const sizeShoesOption = await SizeShoesOption.findAll();

        res.json({
            data,
            sizeOption,
            sizeWearOption,
            sizeShoesOption
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;