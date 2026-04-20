import { literal, Op } from "sequelize";
import { Branches } from "../models/index.js";
import sequelize from "../db.js";

type MatchedBranchParams = {
    bankCode: number;
    branch: string;
};

export const getBranchOne = ({ bankCode, branch }: MatchedBranchParams) => {
    return Branches.findOne({
        where: {
            bank_code: bankCode,
            [Op.or]: [
                { name: branch },
                sequelize.where(literal(`LOWER(normalize->>'name')`), branch.toLowerCase()),
                sequelize.where(literal(`LOWER(normalize->>'kana')`), branch.toLowerCase()),
                sequelize.where(literal(`LOWER(normalize->>'hira')`), branch.toLowerCase()),
            ],
        },
    });
};
