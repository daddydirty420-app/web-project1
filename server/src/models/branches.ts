import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";
import Banks from "./banks.js";

export class Branches extends Model {
    declare id: number;
    declare bank_code: string;
    declare code: string;
    declare name: string;
    declare kana: string | null;
    declare hira: string | null;
    declare normalize: object | null;

    static associate() {
        Branches.belongsTo(Banks, {
            foreignKey: "bank_code",
            targetKey: "code",
        });
    };
};

Branches.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        bank_code: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        code: {
            type: DataTypes.TEXT,
            allowNull: false,
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

export default Branches;