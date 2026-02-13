import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";
import Item from "./item.js";

export class RecommendItem extends Model {
    declare id: number;
    declare recommend_month: boolean;
    declare item_id: number;
    declare user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        RecommendItem.belongsTo(Item, {
            foreignKey: "item_id",
        });
        RecommendItem.belongsTo(User, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        Item: Association<RecommendItem, Item>;
        User: Association<RecommendItem, User>;
    };
}

RecommendItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        recommend_month: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "RecommendItem",
        tableName: "recommend_item",
        freezeTableName: true,
        timestamps: true,
    }
);

export default RecommendItem;