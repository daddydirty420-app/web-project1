import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";
import Item from "./item.js";

export class GoodItem extends Model {
    declare id: number;
    declare item_id: number;
    declare good_user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        GoodItem.belongsTo(Item, {
            foreignKey: "item_id",
        });
        GoodItem.belongsTo(User, {
            foreignKey: "good_user_id",
        });
    }

    static associations: {
        Item: Association<GoodItem, Item>;
        User: Association<GoodItem, User>;
    };
}

GoodItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        good_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "GoodItem",
        tableName: "good_item",
        freezeTableName: true,
        timestamps: true,
    }
);

export default GoodItem;