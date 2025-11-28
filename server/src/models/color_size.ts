import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import SizeOption from "./size_option.js";
import SizeWearOption from "./size_wear_option.js";
import SizeShoesOption from "./size_shoes_option.js";
import User from "./user.js";
import Item from "./item.js";

export class ColorSize extends Model {
    declare id: number;
    declare kind: string | null;
    declare color: string | null;
    declare size: string | null;
    declare image_url: string | null;
    declare stock_all: number | null;
    declare stock_now: number | null;
    declare size_id: number | null;
    declare size_wear_id: number | null;
    declare size_shoes_id: number | null;
    declare user_id: number | null;
    declare item_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        ColorSize.belongsTo(SizeOption, {
            foreignKey: "size_id",
        });
        ColorSize.belongsTo(SizeWearOption, {
            foreignKey: "size_wear_id",
        });
        ColorSize.belongsTo(SizeShoesOption, {
            foreignKey: "size_shoes_id",
        });
        ColorSize.belongsTo(User, {
            foreignKey: "user_id",
        });
        ColorSize.belongsTo(Item, {
            foreignKey: "item_id",
        });
    }

    static associations: {
        SizeOption: Association<ColorSize, SizeOption>;
        SizeWearOption: Association<ColorSize, SizeWearOption>;
        SizeShoesOption: Association<ColorSize, SizeShoesOption>;
        User: Association<ColorSize, User>;
        Item: Association<ColorSize, Item>;
    };
}

ColorSize.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        kind: DataTypes.STRING(255),
        color: DataTypes.STRING(255),
        size: DataTypes.STRING(255),
        image_url: DataTypes.TEXT,
        stock_all: DataTypes.INTEGER,
        stock_now: DataTypes.INTEGER,
        size_id: DataTypes.INTEGER,
        size_wear_id: DataTypes.INTEGER,
        size_shoes_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "ColorSize",
        tableName: "color_size",
        freezeTableName: true,
        timestamps: true,
    }
);

export default ColorSize;