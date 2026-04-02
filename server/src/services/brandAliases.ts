import { Op } from "sequelize";
import { BrandAliases, Brands } from "../models/index.js";
import { GetAllAliasesParams } from "../types/serviceType/brandAliases.js";
import sequelize from "../db.js";

export const findAllAliases = async ({ keyword, directLength }: GetAllAliasesParams) => {
    return BrandAliases.findAll({
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
        limit: 15 - directLength,
    })
};