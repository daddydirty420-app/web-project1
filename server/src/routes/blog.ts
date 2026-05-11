import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { validateParams } from "../middleware/validate/validateParams.js";
import { Blog, BlogCategoryOption } from "../models/index.js";
import { idParamSchema } from "../validators/params/id.js";

const router = Router();

router.get("/list", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const list = await Blog.findAll({
            attributes: ["id", "title", "summary", "image_url", "views_count", "uploaded_at"],
            where: { public: true },
            order: [["uploaded_at", "DESC"]],
            limit,
            offset,
        });

        res.json({ list });
    } catch (err) {
        next(err);
    }
});

router.get("/search", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const keyword = req.query.keyword || "";
        const page = parseInt(req.query.page as string) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const list = await Blog.findAll({
            attributes: ["id", "title", "summary", "image_url", "views_count", "uploaded_at"],
            where: {
                public: true,
                [Op.or]: [{ title: { [Op.iLike]: `%${keyword}%` } }, { summary: { [Op.iLike]: `%${keyword}%` } }],
            },
            order: [["uploaded_at", "DESC"]],
            limit,
            offset,
            include: [
                {
                    model: BlogCategoryOption,
                    attributes: ["id", "name"],
                    required: false,
                    where: keyword
                        ? {
                              name: {
                                  [Op.iLike]: `%${keyword}%`,
                              },
                          }
                        : undefined,
                },
            ],
        });

        res.json({ list });
    } catch (err) {
        next(err);
    }
});

router.get("/search-category", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const blogCategory = req.query.bc || "";

        const includeConditions = [];

        if (blogCategory) {
            includeConditions.push({
                model: BlogCategoryOption,
                where: { id: blogCategory },
                required: true,
            });
        } else {
            includeConditions.push({ model: BlogCategoryOption });
        }

        const list = await Blog.findAll({
            attributes: ["id", "title", "summary", "image_url", "views_count", "uploaded_at"],
            where: { public: true },
            order: [["uploaded_at", "DESC"]],
            limit,
            offset,
            include: includeConditions,
        });

        res.json({ list });
    } catch (err) {
        next(err);
    }
});

router.get(
    "/:id",
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await Blog.findByPk(req.params.id, {
                include: [{ model: BlogCategoryOption }],
            });

            if (!data) {
                res.status(404).json({ message: "ブログが見つかりません。" });
                return;
            }

            const blogViewsRanking = await Blog.findAll({
                attributes: ["id", "title"],
                where: { public: true },
                order: [["views_count", "DESC"]],
                limit: 5,
            });

            const latestBlogList = await Blog.findAll({
                attributes: ["id", "title"],
                where: { public: true },
                order: [["createdAt", "DESC"]],
                limit: 5,
            });

            res.json({
                data,
                blogViewsRanking,
                latestBlogList,
            });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
