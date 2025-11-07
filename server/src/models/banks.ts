import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

export class Banks extends Model {
    declare id: number;
    declare code: string;
    declare name: string;
    declare kana: string | null;
    declare hira: string | null;
    declare normalize: object | null;
};

Banks.init(
    {
        code: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        kana: DataTypes.TEXT,
        hira: DataTypes.TEXT,
        normalize: DataTypes.JSONB,
    },
    {
        sequelize,
        timestamps: false,
    },
);

export default Banks;