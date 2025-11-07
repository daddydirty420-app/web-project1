import { Router, Request, Response } from "express";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { Blog, BlogCategoryOption, ItemCategory1Option } from "../../models/index.js";

const router = Router();

router.get('/confirm/:id', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const blog = await Blog.findByPk(req.params.id, {
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

        if (!blog) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        res.json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/edit/:id', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const blog = await Blog.findByPk(req.params.id);

        if (!blog) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        const blogCategory = await BlogCategoryOption.findAll();
        const itemCategory = await ItemCategory1Option.findAll();

        res.json({
            blog,
            blogCategory,
            itemCategory
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/draft-list', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const list = await Blog.findAll({
            attributes: ['id', 'title', 'summary', 'image_url', 'views_count', 'uploaded_date'],
            where: { public: false },
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

export default router;