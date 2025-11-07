import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class ItemCategory1Option extends Model {
    declare id: number;
    declare name: string;
};

ItemCategory1Option.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "ItemCategory1Option",
        tableName: "item_category1_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default ItemCategory1Option;