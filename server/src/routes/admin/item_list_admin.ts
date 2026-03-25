import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { User, Item, Video } from "../../models/index.js";
import { subDays } from "date-fns";

const router = Router();

router.get('/check', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'uploaded_date', 'first_item_image'],
            where: {
                public: true,
                checked: false
            },
            order: [['uploaded_date', 'ASC']],
            limit: 30,
            include: [
                {
                    model: Video,
                    attributes: ['id', 'video_url', 'thumbnail_url', 'title']
                },
                {
                    model: User,
                    attributes: ['id', 'user_name', 'email']
                }
            ]
        })

        const twoDaysAgo = subDays(new Date(), 2);

        const itemCount = await Item.count({
            where: {
                public: true,
                checked: false
            }
        });

        const itemCount2d = await Item.count({
            where: {
                public: true,
                checked: false,
                uploaded_date: {
                    [Op.lt]: twoDaysAgo
                }
            }
        });

        res.json({
            itemList,
            itemCount,
            itemCount2d
        });
    } catch (err) {
        next(err);
    }
});

router.get('/recommend-item-list', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const itemList = await Item.findAll({
            attributes: ['id', 'name', "status", 'uploaded_at', 'first_image_url'],
            where: {
                status: "active",
                recommend: true,
            },
            order: [['Item.uploaded_at', 'DESC']],
            include: [
                {
                    model: Video,
                    attributes: ['id', 'video_url', 'thumbnail_url', 'title'],
                },
                {
                    model: User,
                    attributes: ['id', 'user_name', 'email'],
                },
            ],
        });

        res.status(200).json({ itemList });
    } catch (err) {
        next(err);
    }
});

export default router;