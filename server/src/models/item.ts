import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";
import ItemConditionOption from "./item_condition_option.js";
import Cart from "./cart.js";
import GoodItem from "./good_item.js";
import Video from "./video.js";
import Sale from "./sale.js";
import Delivery from "./delivery.js";
import ReccomendItem from "./reccomend_item.js";
import ColorSize from "./color_size.js";
import Category from "./category.js";
import ItemReport from "./item_report.js";

export class Item extends Model {
    declare id: number;
    declare name: string | null;
    declare explain: string | null;
    declare image_url: string[] | null;
    declare category_text: string | null;
    declare price: number | null;
    declare sort_number: number | null;
    declare views_count: number | null;
    declare views_24h: number | null;
    declare stock_all: number | null;
    declare stock_now: number | null;
    declare stock_20: number | null;
    declare sold_out: boolean;
    declare draft: boolean;
    declare public: boolean;
    declare not_finish: boolean;
    declare checked: boolean | null;
    declare early_sell: boolean | null;
    declare item_condition_id: number | null;
    declare seller_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare uploaded_date: Date | null;
    declare search_text: string | null;
    declare sort_buzz_number: number | null;
    declare deleted: boolean | null;
    declare deleted_at: Date | null;
    declare first_image_url: string | null;
    declare save_at: Date | null;

    static associate() {
        Item.belongsTo(User, {
            foreignKey: 'seller_id'
        });
        Item.belongsTo(ItemConditionOption, {
            foreignKey: 'item_condition_id'
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
        Item.hasOne(Delivery, {
            foreignKey: 'item_id',
            as: 'ParentDelivery'
        });
        Item.hasMany(Delivery, {
            foreignKey: 'item_id',
            as: 'Deliveries'
        });
        Item.hasOne(ReccomendItem, {
            foreignKey: 'item_id'
        });
        Item.hasMany(ColorSize, {
            foreignKey: 'item_id'
        });
        Item.hasOne(Category, {
            foreignKey: 'item_id'
        });
        Item.hasMany(ItemReport, {
            foreignKey: 'item_id'
        });
    }

    static associations: {
        User: Association<Item, User>;
        ItemConditionOption: Association<Item, ItemConditionOption>;
        Cart: Association<Item, Cart>;
        GoodItem: Association<Item, GoodItem>;
        Video: Association<Item, Video>;
        Sale: Association<Item, Sale>;
        Delivery: Association<Item, Delivery>;
        ReccomendItem: Association<Item, ReccomendItem>;
        ColorSize: Association<Item, ColorSize>;
        Category: Association<Item, Category>;
        ItemReport: Association<Item, ItemReport>;
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
        name: DataTypes.TEXT,
        explain: DataTypes.TEXT,
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
        category_text: DataTypes.TEXT,
        price: DataTypes.INTEGER,
        sort_number: DataTypes.DECIMAL,
        views_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        views_24h: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        stock_all: DataTypes.INTEGER,
        stock_now: DataTypes.INTEGER,
        stock_20: DataTypes.DECIMAL,
        sold_out: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        draft: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        public: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        not_finish: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
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
        uploaded_date: DataTypes.DATE,
        search_text: DataTypes.TEXT,
        sort_buzz_number: DataTypes.DECIMAL,
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        deleted_at: DataTypes.DATE,
        first_image_url: DataTypes.TEXT,
        save_at: DataTypes.DATE,
    },
    {
        sequelize,
        modelName: "Item",
        tableName: "item",
        freezeTableName: true,
        timestamps: true,
    }
);

export default Item;