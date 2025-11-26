import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";
import Item from "./item.js";

export class ReccomendItem extends Model {
    declare id: number;
    declare reccomend_month: boolean;
    declare item_id: number;
    declare user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        ReccomendItem.belongsTo(Item, {
            foreignKey: "item_id",
        });
        ReccomendItem.belongsTo(User, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        Item: Association<ReccomendItem, Item>;
        User: Association<ReccomendItem, User>;
    };
}

ReccomendItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        reccomend_month: {
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
        modelName: "ReccomendItem",
        tableName: "reccomend_item",
        freezeTableName: true,
        timestamps: true,
    }
);

export default ReccomendItem;