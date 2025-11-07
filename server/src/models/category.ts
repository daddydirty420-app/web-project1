import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import Item from "./item.js";
import ItemCategory1Option from "./item_category1_option.js";
import CategoryCampOption from "./category_camp_option.js";
import CategoryHikeOption from "./category_hike_option.js";
import CategoryWearOption from "./category_wear_option.js";
import CategoryOtherOption from "./category_other_option.js";

export class Category extends Model {
    declare id: number;
    declare item_id: number | null;
    declare category1_id: number | null;
    declare camp_id: number | null;
    declare hike_id: number | null;
    declare wear_id: number | null;
    declare other_id: number | null;

    static associate() {
        Category.belongsTo(Item, {
            foreignKey: "item_id",
        });
        Category.belongsTo(ItemCategory1Option, {
            foreignKey: "category1_id",
        });
        Category.belongsTo(CategoryCampOption, {
            foreignKey: "camp_id",
        });
        Category.belongsTo(CategoryHikeOption, {
            foreignKey: "hike_id",
        });
        Category.belongsTo(CategoryWearOption, {
            foreignKey: "wear_id",
        });
        Category.belongsTo(CategoryOtherOption, {
            foreignKey: "other_id",
        });
    }

    static associations: {
        Item: Association<Category, Item>;
        ItemCategory1Option: Association<Category, ItemCategory1Option>;
        CategoryCampOption: Association<Category, CategoryCampOption>;
        CategoryHikeOption: Association<Category, CategoryHikeOption>;
        CategoryWearOption: Association<Category, CategoryWearOption>;
        CategoryOtherOption: Association<Category, CategoryOtherOption>;
    };
}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        item_id: DataTypes.INTEGER,
        category1_id: DataTypes.INTEGER,
        camp_id: DataTypes.INTEGER,
        hike_id: DataTypes.INTEGER,
        wear_id: DataTypes.INTEGER,
        other_id: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: "Category",
        tableName: "category",
        freezeTableName: true,
        timestamps: false,
    }
);

export default Category;