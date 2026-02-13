import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class RecommendMonth extends Model {
    declare id: number;
    declare paid: boolean;
    declare will_cancel: boolean;
    declare user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        RecommendMonth.belongsTo(User, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        User: Association<RecommendMonth, User>;
    };
}

RecommendMonth.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        paid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        will_cancel: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "RecommendMonth",
        tableName: "recommend_month",
        freezeTableName: true,
        timestamps: true,
    }
);

export default RecommendMonth;