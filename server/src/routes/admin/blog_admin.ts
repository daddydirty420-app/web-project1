import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { validateParams } from "../../middleware/validate/validateParams.js";
import { Blog, BlogCategoryOption } from "../../models/index.js";
import { idParamSchema } from "../../validators/params/id.js";

const router = Router();

router.get(
    "/confirm/:id",
    validateParams(idParamSchema),
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const blog = await Blog.findByPk(req.params.id, {
                include: [{ model: BlogCategoryOption }],
            });

            if (!blog) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            res.json({ blog });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/edit/:id",
    validateParams(idParamSchema),
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const blog = await Blog.findByPk(req.params.id);

            if (!blog) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            const blogCategory = await BlogCategoryOption.findAll();

            res.json({
                blog,
                blogCategory,
            });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/draft-list",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 15;
            const offset = (page - 1) * limit;

            const list = await Blog.findAll({
                attributes: ["id", "title", "summary", "image_url", "views_count", "uploaded_at"],
                where: { public: false },
                order: [["uploaded_date", "DESC"]],
                limit,
                offset,
            });

            res.json({ list });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
