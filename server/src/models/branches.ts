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
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING(20),
            allowNull: false,
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
        modelName: "Branches",
        tableName: "branches",
        freezeTableName: true,
        timestamps: false,
    },
);

export default Branches;