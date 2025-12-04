import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { Blog, BlogCategoryOption, ItemCategory1Option } from "../models/index.js";

const router = Router();

router.get('/list', async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const list = await Blog.findAll({
            attributes: ['id', 'title', 'summary', 'image_url', 'views_count', 'uploaded_date'],
            where: { public: true },
            order: [['uploaded_date', 'DESC']],
            limit,
            offset
        });

        if (!list) {
            res.status(404).json({ error: 'ブログが見つかりません。' });
            return;
        }

        res.json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/search', async (req: Request, res: Response): Promise<void> => {
    try {
        const keyword = req.query.keyword || '';
        const page = parseInt(req.query.page as string) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const list = await Blog.findAll({
            attributes: ['id', 'title', 'summary', 'image_url', 'views_count', 'uploaded_date'],
            where: {
                public: true,
                [Op.or]: [
                    { title: { [Op.iLike]: `%${keyword}%`} },
                    { summary: { [Op.iLike]: `%${keyword}%` } }
                ]
            },
            order: [['uploaded_date', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: BlogCategoryOption,
                    attributes: ['id', 'name'],
                    required: false,
                    where: keyword
                    ? {
                        name: {
                            [Op.iLike]: `%${keyword}%`
                        }
                    }
                    :undefined
                },
                {
                    model: ItemCategory1Option,
                    attributes: ['id', 'name'],
                    required: false,
                    where: keyword
                    ? {
                        name: {
                            [Op.iLike]: `%${keyword}%`
                        }
                    }
                    :undefined
                }
            ]
        });

        if (!list) {
            res.status(404).json({ error: '検索結果が見つかりません。' });
            return;
        }

        res.json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/search-category', async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const blogCategory = req.query.bc || '';
        const itemCategory = req.query.ic || '';

        const includeConditions = [];

        if (blogCategory) {
            includeConditions.push({
                model: BlogCategoryOption,
                attriibutes: ['id', 'name'],
                where: {
                    id: blogCategory
                },
                required: true
            });
        } else {
            includeConditions.push({
                model: BlogCategoryOption,
                attributes: ['id', 'name']
            });
        }

        if (itemCategory) {
            includeConditions.push({
                model: ItemCategory1Option,
                attributes: ['id', 'name'],
                where: {
                    id: itemCategory
                },
                required: true
            });
        } else {
            includeConditions.push({
                model: ItemCategory1Option,
                attributes: ['id', 'name'],
            });
        }

        const list = await Blog.findAll({
            attributes: ['id', 'title', 'summary', 'image_url', 'views_count', 'uploaded_date'],
            where: { public: true },
            order: [['uploaded_date', 'DESC']],
            limit,
            offset,
            include: includeConditions
        });

        if (!list) {
            res.status(404).json({ error: 'ブログが見つかりません。' });
            return;
        }

        res.json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Blog.findByPk(req.params.id, {
            include: [
                {
                    model: BlogCategoryOption,
                    attributes: ['id', 'name']
                },
                {
                    model: ItemCategory1Option,
                    attributes: ['id', 'name']
                }
            ]
        });

        if (!data) {
            res.status(404).json({ message: 'ブログが見つかりません。' });
            return;
        }

        const blogViewsRanking = await Blog.findAll({
            attributes: ['id', 'title'],
            where: { public: true },
            order: [['views_count', 'DESC']],
            limit: 5
        });

        const latestBlogList = await Blog.findAll({
            attributes: ['id', 'title'],
            where: { public: true },
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        res.json({
            data,
            blogViewsRanking,
            latestBlogList
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;