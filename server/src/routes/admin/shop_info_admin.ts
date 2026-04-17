import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { Op, fn, WhereOptions, literal } from "sequelize";
import {
    ShopInfo,
    User,
    ComOrFreeOption,
    Address,
    Name,
    TodouhukenOption,
    BankAccount,
    AccountTypeOption,
    UriagekinHistory,
} from "../../models/index.js";
import { subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";

const router = Router();

router.get(
    "/list",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const keyword = req.query?.keyword ?? null;

        const base = { verified: true };

        const whereCondition: WhereOptions = keyword
            ? ({
                  [Op.and]: [
                      base,
                      {
                          [Op.or]: [
                              { conpany_name: { [Op.iLike]: `%${keyword}%` } },
                              { shop_name: { [Op.iLike]: `%${keyword}%` } },
                          ],
                      },
                  ],
              } as WhereOptions)
            : (base as WhereOptions);

        try {
            const dataList = await ShopInfo.findAll({
                attributes: ["id", "company_name", "shop_name"],
                where: whereCondition,
                order: [["createdAt", "DESC"]],
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

router.get(
    "/signup-list",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dataList = await ShopInfo.findAll({
                attributes: ["id", "company_name", "id_card_front", "id_card_rear"],
                where: {
                    request_all: true,
                    verified: false,
                },
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

            const shopCount = dataList.length || 0;
            const twoDaysAgo = subDays(new Date(), 2);
            const shopCount2d = await ShopInfo.count({
                where: {
                    request_all: true,
                    verified: false,
                    createdAt: { [Op.lte]: twoDaysAgo },
                },
            });

            res.json({
                dataList,
                shopCount,
                shopCount2d,
            });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/trans-auto-make",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));
        const endOfLastMonth = endOfMonth(subMonths(new Date(), 1));

        try {
            const dataList = await ShopInfo.findAll({
                attributes: ["id", "company_name", "shop_name"],
                where: { auto_trans: true },
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: BankAccount,
                        attributes: ["id"],
                    },
                    {
                        model: User,
                        attributes: [
                            "id",
                            "user_name",
                            "email",
                            [
                                fn(
                                    "COALESCE",
                                    fn(
                                        "SUM",
                                        literal(
                                            '"User->UriagekinHistories"."uriagekin" - "User->UriagekinHistories"."uriagekin_used"',
                                        ),
                                    ),
                                    0,
                                ),
                                "monthly_uriagekin",
                            ],
                        ],
                        include: [
                            {
                                model: UriagekinHistory,
                                attributes: ["id"],
                                where: {
                                    createdAt: {
                                        [Op.between]: [startOfLastMonth, endOfLastMonth],
                                    },
                                },
                                required: false,
                            },
                        ],
                    },
                ],
                group: ["ShopInfo.id", "BankAccount.id", "User.id"],
                subQuery: false,
            });

            const dataCount = dataList.length || 0;

            const uriagekinAmount = dataList.reduce((sum: number, data: any) => {
                const monthly = Number(data.User?.get?.("monthly_uriagekin") ?? 0);
                return sum + monthly;
            }, 0);

            res.json({
                dataList,
                dataCount,
                uriagekinAmount,
            });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/:id",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await ShopInfo.findByPk(req.params.id, {
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
                    {
                        model: BankAccount,
                        attributes: ["id", "bank_name", "branch_code", "account_number", "meigi"],
                        include: [{ model: AccountTypeOption }],
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

export default router;
