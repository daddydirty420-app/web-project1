import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import RecommendMonth from "./recommend_month.js";
import RecommendItem from "./recommend_item.js";
import User from "./user.js";

export class RecommendPaidInfo extends Model {
    declare id: number;
    declare user_id: number;
    declare recommend_month_id: number | null;
    declare price: number;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare recommend_item_id: number | null;
    declare pay_id: string | null;

    static associate() {
        RecommendPaidInfo.belongsTo(User, {
            foreignKey: 'user_id'
        });
        RecommendPaidInfo.belongsTo(RecommendMonth, {
            foreignKey: 'recommend_month_id'
        });
        RecommendPaidInfo.belongsTo(RecommendItem, {
            foreignKey: 'recommend_item_id'
        });
    }

    static associations: {
        User: Association<RecommendPaidInfo, User>;
    };
}

RecommendPaidInfo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        recommend_month_id: DataTypes.INTEGER,
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        recommend_item_id: DataTypes.INTEGER,
        pay_id: {
            type: DataTypes.STRING(50),
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "RecommendPaidInfo",
        tableName: "recommend_paid_info",
        freezeTableName: true,
        timestamps: true,
    }
);

export default RecommendPaidInfo;