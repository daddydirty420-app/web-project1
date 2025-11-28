import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import Item from "./item.js";
import User from "./user.js";
import ShippingDayOption from "./shipping_day_option.js";
import ShippingServiceOption from "./shipping_service_option.js";
import DeliveryStatusOption from "./delivery_status_option.js";
import TodouhukenOption from "./todouhuken_option.js";
import PaidInfo from "./paid_info.js";
import ColorSize from "./color_size.js";
import Address from "./address.js";
import Name from "./name.js";

export class Delivery extends Model {
    declare id: number;
    declare buyer_phone_number: string | null;
    declare cancel: boolean | null;
    declare shipping_day_id: number | null;
    declare shipping_service_id: number | null;
    declare delivery_status_id: number | null;
    declare shipping_place_id: number | null;
    declare parent_data_id: number | null;
    declare paid_info_id: number | null;
    declare item_id: number | null;
    declare color_size_id: number | null;
    declare seller_user_id: number | null;
    declare buyer_user_id: number | null;
    declare buy_date: Date | null;
    declare shipping_date: Date | null;
    declare arrived_date: Date | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare arrive_specified_date: Date | null;
    declare parent_data: boolean | null;

    static associate() {
        Delivery.belongsTo(ShippingDayOption, {
            foreignKey: "shipping_day_id",
        });
        Delivery.belongsTo(ShippingServiceOption, {
            foreignKey: "shipping_service_id",
        });
        Delivery.belongsTo(DeliveryStatusOption, {
            foreignKey: "delivery_status_id",
        });
        Delivery.belongsTo(TodouhukenOption, {
            foreignKey: "shipping_place_id",
            as: "DeliveryTodouhuken",
        });
        Delivery.belongsTo(Delivery, {
            foreignKey: "parent_data_id",
        });
        Delivery.belongsTo(PaidInfo, {
            foreignKey: "paid_info_id",
        });
        Delivery.belongsTo(Item, {
            foreignKey: "item_id",
        });
        Delivery.belongsTo(ColorSize, {
            foreignKey: "color_size_id",
        });
        Delivery.belongsTo(User, {
            foreignKey: "seller_user_id",
            as: "Seller",
        });
        Delivery.belongsTo(User, {
            foreignKey: "buyer_user_id",
            as: "Buyer",
        });
        Delivery.hasOne(Address, {
            foreignKey: "delivery_id",
        });
        Delivery.hasOne(Name, {
            foreignKey: "delivery_id",
        });
    }

    static associations: {
        ShippingDayOption: Association<Delivery, ShippingDayOption>;
        ShippingServiceOption: Association<Delivery, ShippingServiceOption>;
        DeliveryStatusOption: Association<Delivery, DeliveryStatusOption>;
        TodouhukenOption: Association<Delivery, TodouhukenOption>;
        Delivery: Association<Delivery, Delivery>;
        PaidInfo: Association<Delivery, PaidInfo>;
        Item: Association<Delivery, Item>;
        ColorSize: Association<Delivery, ColorSize>;
        User: Association<Delivery, User>;
        Address: Association<Delivery, Address>;
        Name: Association<Delivery, Name>;
    };
}

Delivery.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        buyer_phone_number: DataTypes.STRING(255),
        cancel: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        shipping_day_id: DataTypes.INTEGER,
        shipping_service_id: DataTypes.INTEGER,
        delivery_status_id: DataTypes.INTEGER,
        shipping_place_id: DataTypes.INTEGER,
        parent_data_id: DataTypes.INTEGER,
        paid_info_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
        item_id: DataTypes.INTEGER,
        color_size_id: DataTypes.INTEGER,
        seller_user_id: DataTypes.INTEGER,
        buyer_user_id: DataTypes.INTEGER,
        buy_date: DataTypes.DATE,
        shipping_date: DataTypes.DATE,
        arrived_date: DataTypes.DATE,
        arrive_specified_date: DataTypes.DATE,
        parent_data: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    },
    {
        sequelize,
        modelName: "Delivery",
        tableName: "delivery",
        freezeTableName: true,
        timestamps: true,
    }
);

export default Delivery;