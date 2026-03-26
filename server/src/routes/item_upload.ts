import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Categories, Brands, BrandAliases } from "../models/index.js";
import sequelize from "../db.js";
import { Op } from "sequelize";
import { normalizeJapanese } from "../utils/normalizeJapanese.js";

const router = Router();

router.get("/category2/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parentId = req.params.id;
    const parentIdNum = Number(parentId);

    try {
        const category2 = await Categories.findAll({
            where: {
                parent_id: parentIdNum,
                level: 2,
            },
            order: [["sort_order", "ASC"]],
        });

        res.status(200).json({ category2 });
    } catch (err) {
        next(err);
    }
});

router.get("/brand-suggest", async (req: Request, res: Response): Promise<void> => {
    const keyword = normalizeJapanese((req.query.keyword ?? "") as string);

    if (!keyword) {
        res.status(200).json({ suggest: [] });
        return;
    }

    try {
        const direct = await Brands.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${keyword}%`,
                },
            },
            order: [[sequelize.fn("length", sequelize.col("Brands.name")), "ASC"]],
            limit: 15,
        });

        let fromAlias = null;

        if (direct.length < 15) {
            fromAlias = await BrandAliases.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${keyword}%`,
                            },
                        },
                        {
                            name_normalized: {
                                [Op.iLike]: `%${keyword}%`,
                            },
                        },
                    ],
                },
                include: [
                    {
                        model: Brands,
                        as: "brand",
                        required: true,
                    },
                ],
                order: [[sequelize.fn("length", sequelize.col("BrandAliases.name")), "ASC"]],
                limit: 15 - direct.length,
            });
        }

        const brandMap = new Map<number, typeof Brands>();

        for (const d of direct) {
            brandMap.set(d.id, d);
        }

        for (const alias of fromAlias) {
            if (alias.brand) {
                brandMap.set(alias.brand.id, alias.brand);
            }
        }

        const result = Array.from(brandMap.values());

        res.status(200).json({ brands: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ suggest: [] });
    }
});

export default router;