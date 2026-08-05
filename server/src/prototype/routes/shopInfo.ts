import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../../middleware/index.js";
import { validateParams } from "../../middleware/validate/validateParams.js";
import { Address, ComOrFreeOption, Name, ShopInfo, TodouhukenOption } from "../../models/index.js";
import { idParamSchema } from "../../validators/params/id.js";

const router = Router();

router.get("/com-or-free", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await ComOrFreeOption.findAll();

        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

router.get(
    "/edit-form/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await ShopInfo.findByPk(req.params.id, {
                attributes: ["id"],
                include: [{ model: ComOrFreeOption }],
            });

            if (!data) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            const allOptions = await ComOrFreeOption.findAll();

            res.json({
                data: data,
                allOptions: allOptions,
            });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/edit-other/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await ShopInfo.findByPk(req.params.id, {
                attributes: [
                    "id",
                    "homepage_url",
                    "open_date_time",
                    "company_number",
                    "capital",
                    "member_count",
                    "founded_date",
                ],
            });

            if (!data) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            res.json(data);
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/infopage/:id",
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await ShopInfo.findByPk(req.params.id, {
                attributes: [
                    "id",
                    "company_name",
                    "shop_name",
                    "email",
                    "phone_number",
                    "homepage_url",
                    "open_date_time",
                    "open_info",
                ],
                include: [
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
                        model: Name,
                        attributes: ["sei", "mei", "sei_kana", "mei_kana"],
                    },
                ],
            });

            if (!data) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            res.json({ data });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/open-info-request/:id",
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await ShopInfo.findByPk(req.params.id, {
                attributes: ["id", "shop_name"],
            });

            if (!data) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            res.json({ data });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
