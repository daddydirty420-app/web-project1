import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../../../middleware/index.js";
import { validateParams } from "../../../middleware/validate/validateParams.js";
import { Item, Video } from "../../../models/index.js";
import { idParamSchema } from "../../../validators/params/id.js";

const router = Router();

router.get(
    "/file-edit-page/:id",
    validateParams(idParamSchema),
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const item = await Item.findByPk(req.params.id, {
                attributes: ["id", "name", "image_url", "sold_out"],
                include: [
                    {
                        model: Video,
                        attributes: ["id", "original_url", "converted_url", "thumbnail_url", "title"],
                    },
                ],
            });

            if (!item) {
                res.status(404).json({ message: "アイテムが見つかりません。" });
                return;
            }

            res.json({ item });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
