import { Op } from "sequelize";
import { BrandAliases, Brands } from "../../models/index.js";
import sequelize from "../../db.js";

type Params = {
    keyword: string;
};

export const getBrandsSuggest = async ({ keyword }: Params) => {

    // Brands取得
    const direct = await Brands.findAll({
        where: {
            name: {
                [Op.iLike]: `%${keyword}%`,
            },
        },
        order: [[sequelize.fn("length", sequelize.col("Brands.name")), "ASC"]],
        limit: 15,
    });

    // BrandAliases取得
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

    const brands = Array.from(brandMap.values());

    return brands;
};