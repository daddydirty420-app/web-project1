import { Router, Request, Response } from "express";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { ShopInfoEdit, ComOrFreeOption, Address, Name, TodouhukenOption } from "../models/index.js";

const router = Router();

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