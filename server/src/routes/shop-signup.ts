import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import {
    AccountTypeOption,
    Address,
    BankAccount,
    ComOrFreeOption,
    Name,
    ShopInfo,
    TodouhukenOption,
} from "../models/index.js";

const router = Router();

router.get(
    "/signup3/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await ShopInfo.findByPk(req.params.id, {
                attributes: ["id", "id_card_front", "id_card_rear", "permit_url"],
            });

            if (!data) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/signup5/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = req.params.id;

        try {
            const data = await ShopInfo.findByPk(shopId, {
                attributes: [
                    "id",
                    "company_name",
                    "shop_name",
                    "phone_number",
                    "email",
                    "open_date_time",
                    "founded_date",
                    "member_count",
                    "homepage_url",
                    "company_number",
                    "capital",
                    "auto_trans",
                    "open_info",
                ],
                include: [
                    {
                        model: ComOrFreeOption,
                    },
                    {
                        model: Name,
                        as: "RepresentativeName",
                        attributes: ["sei", "mei", "sei_kana", "mei_kana"],
                    },
                    {
                        model: Name,
                        as: "ContactName",
                        attributes: ["sei", "mei", "sei_kana", "mei_kana"],
                    },
                    {
                        model: Address,
                        attributes: ["post_number", "shikutyouson", "banchi", "building"],
                        include: [
                            {
                                model: TodouhukenOption,
                                as: "AddressTodouhuken",
                            },
                        ],
                    },
                    {
                        model: BankAccount,
                        attributes: ["bank_name", "branch_code", "account_number", "meigi"],
                        include: [{ model: AccountTypeOption }],
                    },
                ],
            });

            if (!data) {
                res.status(404).json({ message: "ショップデータが見つかりません。" });
                return;
            }

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
