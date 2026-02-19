import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";
import type { ItemAttributes } from "../types/itemAttributes.js";

import User from "./user.js";
import ItemConditionOption from "./item_condition_option.js";
import Cart from "./cart.js";
import GoodItem from "./good_item.js";
import Video from "./video.js";
import Sale from "./sale.js";
import ItemReport from "./item_report.js";
import Categories from "./categories.js";
import Brands from "./brands.js";
import ItemShippingProfile from "./item_shipping_profile.js";
import BrandAliases from "./brand_aliases.js";

export class Item extends Model {
    declare id: number;
    declare name: string | null;
    declare detail: string | null;
    declare image_url: string[] | null;
    declare price: number | null;
    declare sort_number: number | null;
    declare views_count: number | null;
    declare checked: boolean | null;
    declare early_sell: boolean | null;
    declare item_condition_id: number | null;
    declare seller_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare uploaded_date: Date | null;
    declare search_text: string | null;
    declare sort_buzz_number: number | null;
    declare deleted_at: Date | null;
    declare first_image_url: string | null;
    declare save_at: Date | null;
    declare gender_type: "men" | "women" | "unisex";
    declare age_type: "adult" | "kids" | "both";
    declare status: "editing" | "draft" | "active" | "hidden" | "soldout" | "deleted";
    declare category_id: number | null;
    declare brand_id: number | null;
    declare brand_aliases_id: number | null;
    declare attributes: ItemAttributes;
    declare recommend: boolean | null;

    static associate() {
        Item.belongsTo(User, {
            foreignKey: 'seller_id'
        });
        Item.belongsTo(ItemConditionOption, {
            foreignKey: 'item_condition_id'
        });
        Item.belongsTo(Categories, {
            foreignKey: 'category_id',
            as: "Category",
        });
        Item.belongsTo(Brands, {
            foreignKey: 'brand_id',
            as: "Brand",
        });
        Item.belongsTo(BrandAliases, {
            foreignKey: 'brand_aliases_id',
        });
        Item.hasMany(Cart, {
            foreignKey: 'item_id'
        });
        Item.hasMany(GoodItem, {
            foreignKey: 'item_id'
        });
        Item.hasOne(Video, {
            foreignKey: 'item_id'
        });
        Item.hasOne(Sale, {
            foreignKey: 'item_id'
        });
        Item.hasMany(ItemReport, {
            foreignKey: 'item_id'
        });
        Item.hasOne(ItemShippingProfile, {
            foreignKey: "item_id"
        });
    }

    static associations: {
        User: Association<Item, User>;
        ItemConditionOption: Association<Item, ItemConditionOption>;
        Cart: Association<Item, Cart>;
        GoodItem: Association<Item, GoodItem>;
        Video: Association<Item, Video>;
        Sale: Association<Item, Sale>;
        Categories: Association<Item, Categories>;
        ItemReport: Association<Item, ItemReport>;
        Brand: Association<Item, Brands>;
        BrandAliases: Association<Item, BrandAliases>;
        ItemShippingProfile: Association<Item, ItemShippingProfile>;
    };
}

Item.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING(255),
        detail: DataTypes.TEXT,
        image_url: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            validate: {
                maxArrayLength(value: string[]) {
                    if (value && value.length > 10) {
                        throw new Error('画像は最大10枚までです。');
                    }
                }
            }
        },
        price: DataTypes.INTEGER,
        sort_number: DataTypes.DECIMAL,
        views_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        checked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        early_sell: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        item_condition_id: DataTypes.INTEGER,
        seller_id: DataTypes.INTEGER,
        uploaded_at: DataTypes.DATE,
        search_text: DataTypes.TEXT,
        sort_buzz_number: DataTypes.DECIMAL,
        deleted_at: DataTypes.DATE,
        first_image_url: DataTypes.TEXT,
        save_at: DataTypes.DATE,
        gender_type: {
            type: DataTypes.ENUM("men", "women", "unisex"),
            allowNull: false,
            defaultValue: "unisex",
        },
        age_type: {
            type: DataTypes.ENUM("adult", "kids", "both"),
            allowNull: false,
            defaultValue: "both",
        },
        status: {
            type: DataTypes.ENUM("editing", "draft", "active", "hidden", "soldout", "deleted"),
            allowNull: false,
            defaultValue: "editing",
        },
        category_id: DataTypes.INTEGER,
        brand_id: DataTypes.INTEGER,
        brand_aliases_id: DataTypes.INTEGER,
        attributes: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        recommend: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "Item",
        tableName: "item",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Item;