import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../../../middleware/index.js";
import { Address, ComOrFreeOption, Name, ShopInfoEdit, TodouhukenOption } from "../../../models/index.js";

const router = Router();

router.get(
    "/admin/list",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dataList = await ShopInfoEdit.findAll({
                order: [["createdAt", "ASC"]],
                include: [
                    { model: ComOrFreeOption },
                    {
                        model: Address,
                        attributes: ["id", "post_number", "shikutyouson", "banchi", "building"],
                        include: [
                            {
                                model: TodouhukenOption,
                                as: "AddressTodouhuken",
                            },
                        ],
                    },
                    {
                        model: Name,
                        attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                    },
                ],
            });

            res.json({ dataList });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
