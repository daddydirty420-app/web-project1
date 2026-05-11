import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { col, fn, literal } from "sequelize";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { validateParams } from "../../middleware/validate/validateParams.js";
import {
    Comment,
    CommentReport,
    CommentReportOption,
    Item,
    ItemBuyerReport,
    ItemBuyerReportOption,
    ItemReport,
    ItemReportOption,
    Orders,
    User,
    Video,
} from "../../models/index.js";
import { idParamSchema } from "../../validators/params/id.js";

const router = Router();

router.get(
    "/item/report-all",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const itemList = await Item.findAll({
                attributes: ["id", "name", "uploaded_at", [fn("COUNT", col("ItemReports.id")), "report_count"]],
                include: [
                    {
                        model: Video,
                        attributes: ["play_count"],
                        required: false,
                    },
                    {
                        model: ItemReport,
                        attributes: ["id"],
                        required: true,
                    },
                ],
                group: ["Item.id", "Video.id"],
                order: [
                    [literal("report_count"), "DESC"],
                    [col("Video.play_count"), "DESC"],
                    ["uploaded_date", "DESC"],
                ],
                subQuery: false,
            });

            res.json({ itemList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/comment/report-all",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const commentList = await Comment.findAll({
                attributes: ["id", "text", [fn("COUNT", col("CommentReports.id")), "report_count"]],
                include: [
                    {
                        model: CommentReport,
                        attributes: ["id"],
                        required: true,
                    },
                ],
                group: ["Comment.id"],
                order: [
                    [literal("report_count"), "DESC"],
                    ["createdAt", "DESC"],
                ],
                subQuery: false,
            });

            res.json({ commentList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/item/report-list/:id",
    validateParams(idParamSchema),
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = req.params.id;

        try {
            const reportList = await ItemReport.findAll({
                where: { item_id: itemId },
                order: [["createdAt", "DESC"]],
                include: [
                    { model: ItemReportOption },
                    {
                        model: Item,
                        attributes: ["id", "name"],
                    },
                ],
            });

            res.json({ reportList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/comment/report-list/:id",
    validateParams(idParamSchema),
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const commentId = req.params.id;

        try {
            const reportList = await CommentReport.findAll({
                where: { comment_id: commentId },
                order: [["createdAt", "DESC"]],
                include: [
                    { model: CommentReportOption },
                    {
                        model: Comment,
                        attributes: ["id", "text"],
                    },
                ],
            });

            res.json({ reportList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/buyer/report-list",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dataList = await ItemBuyerReport.findAll({
                where: { checked: false },
                order: [["createdAt", "ASC"]],
                include: [
                    {
                        model: User,
                        attributes: ["id", "user_name", "email"],
                    },
                    {
                        model: Item,
                        attributes: ["id", "name"],
                    },
                    { model: ItemBuyerReportOption },
                    {
                        model: Orders,
                        attributes: ["id", "total_amount", "sales_commission_amount", "gain_amount", "status"],
                        include: [
                            {
                                model: User,
                                as: "Seller",
                                attributes: ["id", "user_name", "email"],
                            },
                        ],
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
