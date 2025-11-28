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
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        kana: DataTypes.STRING(255),
        hira: DataTypes.STRING(255),
        normalize: DataTypes.JSONB,
    },
    {
        sequelize,
        timestamps: false,
    },
);

export default Banks;