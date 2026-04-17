import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import ShippingDayOption from "./shipping_day_option.js";
import ShippingServiceOption from "./shipping_service_option.js";
import DeliveryStatusOption from "./delivery_status_option.js";
import TodouhukenOption from "./todouhuken_option.js";
import Orders from "./orders.js";
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
    declare orders_id: number | null;
    declare shipping_at: Date | null;
    declare arrived_at: Date | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare arrive_specified_date: Date | null;
    declare shipping_service_free_text: string | null; // 自由入力配送方法（その他の場合のみ）
    declare shipping_from_name: string | null; // 出品者氏名
    declare shipping_from_postcode: string | null; // 出品者郵便番号
    declare shipping_from_prefecture: string | null; // 出品者都道府県
    declare shipping_from_address_line1: string | null; // 出品者市区町村・丁目・番地
    declare shipping_from_address_line2: string | null; // 出品者住所（建物名・部屋番号・補足）
    declare shipping_from_phone: string | null; // 出品者電話番号
    declare tracking_number: string | null; // 追跡番号（手入力）
    declare shipping_memo: string | null; // 配送メモ（自由入力）

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
        });
        Delivery.belongsTo(Orders, {
            foreignKey: "orders_id",
        });
        Delivery.hasOne(Address, {
            foreignKey: "delivery_id",
        }); // buyer
        Delivery.hasOne(Name, {
            foreignKey: "delivery_id",
        }); // buyer
    }

    static associations: {
        ShippingDayOption: Association<Delivery, ShippingDayOption>;
        ShippingServiceOption: Association<Delivery, ShippingServiceOption>;
        DeliveryStatusOption: Association<Delivery, DeliveryStatusOption>;
        TodouhukenOption: Association<Delivery, TodouhukenOption>;
        Orders: Association<Delivery, Orders>;
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
            defaultValue: false,
        },
        shipping_day_id: DataTypes.INTEGER,
        shipping_service_id: DataTypes.INTEGER,
        delivery_status_id: DataTypes.INTEGER,
        shipping_place_id: DataTypes.INTEGER,
        orders_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
        shipping_at: DataTypes.DATE,
        arrived_at: DataTypes.DATE,
        arrive_specified_date: DataTypes.DATE,
        shipping_service_free_text: DataTypes.STRING(255),
        shipping_from_name: DataTypes.STRING(255),
        shipping_from_postcode: DataTypes.STRING(255),
        shipping_from_prefecture: DataTypes.STRING(255),
        shipping_from_address_line1: DataTypes.STRING(255),
        shipping_from_address_line2: DataTypes.STRING(255),
        shipping_from_phone: DataTypes.STRING(255),
        tracking_number: DataTypes.STRING(255),
        shipping_memo: DataTypes.TEXT,
    },
    {
        sequelize,
        modelName: "Delivery",
        tableName: "delivery",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Delivery;
