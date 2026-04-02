import { Op } from "sequelize";
import { Brands } from "../models/index.js";
import { GetAllBrandsParams } from "../types/serviceType/brands.js";
import sequelize from "../db.js";

export type BrandsInstance = InstanceType<typeof Brands>;

export const findAllBrands = async ({ keyword }: GetAllBrandsParams) => {
    return Brands.findAll({
        where: {
            name: {
                [Op.iLike]: `%${keyword}%`,
            },
        },
        order: [[sequelize.fn("length", sequelize.col("Brands.name")), "ASC"]],
        limit: 15,
    }) as unknown as BrandsInstance[];
};