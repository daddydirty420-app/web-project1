// ポイント変換時ログ

import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class PointConversionLogs extends Model {
    declare id: number;
    declare trans_points: number;
    declare before_points: number;
    declare after_points: number;
    declare reason: string;
    declare user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        PointConversionLogs.belongsTo(User, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        User: Association<PointConversionLogs, User>;
    };
}

PointConversionLogs.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        converted_points: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        before_points: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        after_points: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        plus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "PointConversionLogs",
        tableName: "point_conversion_logs",
        freezeTableName: true,
        timestamps: true,
    },
);

export default PointConversionLogs;