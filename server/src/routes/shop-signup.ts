import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/index.js";
import { ShopInfo, ComOrFreeOption, Address, Name, TodouhukenOption, BankAccount, AccountTypeOption } from "../models/index.js";

const router = Router();

router.post("/signup1-create", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const optionId = req.body.optionId || null;
    if (!optionId || optionId === null || optionId > 2) {
        res.status(400).json({ message: "事業形態が未入力です。" });
        return;
    }

    try {
        const data = await ShopInfo.create({
            user_id: userId,
            com_or_free_id: optionId,
        });

        res.status(200).json({ id: data.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/signup2/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await ShopInfo.findByPk(req.params.id, {
            attributes: ['id', 'company_name', 'shop_name', 'email', 'phone_number', 'homepage_url', 'open_date_time', 'company_number', 'capital', 'menber_count', 'founded_date'],
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

router.get('/signup3/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await ShopInfo.findByPk(req.params.id, {
            attributes: ['id', 'id_card_front', 'id_card_rear', 'permit_url']
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

router.get('/upload-permit-list/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const imageList = await ShopInfo.findByPk(req.params.id, {
            attributes: ['permit_url']
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

router.get('/signup4/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await ShopInfo.findByPk(req.params.id, {
            attributes: ['id'],
            include: [
                {
                    model: BankAccount,
                    attributes: ['id', 'bank_name', 'branch_code', 'account_number', 'meigi'],
                    include: [
                        {
                            model: AccountTypeOption,
                            attributes: ['id', 'name']
                        }
                    ]
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

export default router;