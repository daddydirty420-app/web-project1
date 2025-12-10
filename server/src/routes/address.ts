import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import fetchAddressFromZip from "../services/addressService.js";
import { Address, TodouhukenOption } from "../models/index.js";

const router = Router();

router.patch("/address-edit/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const todouhuken = req.body.todouhuken;
    const postNumber = req.body.postNumber;
    const shikutyouson = req.body.shikutyouson;

    try {
        const address = await Address.findByPk(req.params.id, {
            include: [
                {
                    model: TodouhukenOption,
                    as: "AddressTodouhuken",
                }
            ]
        });
        if (!address) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        const todouhukenData = await TodouhukenOption.findOne({
            where: {
                name: todouhuken,
            },
        });
        if (!todouhukenData || (todouhukenData.id < 1 || todouhukenData.id > 47)) {
            res.status(404).json({ message: "都道府県が不正な値です。" });
            return;
        }

        try {
            const fromZip = await fetchAddressFromZip(postNumber);

            if (fromZip.todouhuken_name !== todouhuken) {
                res.status(400).json({ message: "郵便番号と都道府県が一致しません。" });
                return;
            }

            if (fromZip.shikutyouson !== shikutyouson) {
                res.status(400).json({ message: "郵便番号と市区町村が一致しません。" });
                return;
            }
        } catch (err) {
            console.error("住所チェックエラー：", err);
            res.status(400).json({ message: "郵便番号が不正です。" });
            return;
        }

        await address.update({
            post_number: postNumber,
            todouhuken_id: todouhukenData.id,
            shikutyouson: shikutyouson,
            banchi: req.body.banchi,
            building: req.body.building,
        });

        res.status(200).json({ message: "住所を更新しました。" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/myaddress', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Address.findOne({
            attributes: ['id', 'post_number', 'todouhuken_id', 'shikutyouson', 'banchi', 'building'],
            where: { user_id: req.user!.id },
            include: [
                {
                    model: TodouhukenOption,
                    as: 'AddressTodouhuken',
                    required: false
                }
            ]
        });

        if (!data) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/delivery-address/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Address.findOne({
            attributes: ['id', 'post_number', 'shikutyouson', 'banchi', 'building', 'delivery_id', 'user_id'],
            where: { delivery_id: req.params.id },
            include: [
                {
                    model: TodouhukenOption,
                    as: 'AddressTodouhuken',
                    attributes: ['id', 'name'],
                }
            ]
        });

        if (!data) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/get-address', async (req: Request, res: Response): Promise<void> => {
    const { zipcode } = req.query;

    if (!zipcode) {
        res.status(400).json({ message: '郵便番号が必要です。' });
        return;
    }

    try {
        const address = await fetchAddressFromZip(zipcode as string);
        res.json({ address });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '住所の取得に失敗しました。' });
    }
});

export default router;