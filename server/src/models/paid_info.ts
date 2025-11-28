import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import PaymentMethodOption from "./payment_method_option.js";
import Item from "./item.js";
import ColorSize from "./color_size.js";
import Delivery from "./delivery.js";
import User from "./user.js";
import Chat from "./chat.js";
import Cancel from "./cancel.js";

export class PaidInfo extends Model {
    declare id: number;
    declare price: number | null;
    declare total_amount: number | null;
    declare points_used: number | null;
    declare sales_commission_amount: number | null;
    declare gain_amount: number | null;
    declare item_count: number | null;
    declare paid_ok: boolean | null;
    declare trans_finish: boolean | null;
    declare cancel: boolean | null;
    declare return_item: boolean | null;
    declare payment_method_id: number | null;
    declare item_id: number | null;
    declare color_size_id: number | null;
    declare seller_user_id: number | null;
    declare buyer_user_id: number | null;
    declare buy_date: Date | null;
    declare paid_date: Date | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare pay_id: string | null;
    declare item_name: string | null;
    declare item_image: string | null;

    static associate() {
        PaidInfo.belongsTo(PaymentMethodOption, {
            foreignKey: 'payment_method_id'
        });
        PaidInfo.belongsTo(Item, {
            foreignKey: 'item_id'
        });
        PaidInfo.belongsTo(ColorSize, {
            foreignKey: 'color_size_id'
        });
        PaidInfo.belongsTo(User, {
            foreignKey: 'seller_user_id',
            as: 'Seller'
        });
        PaidInfo.belongsTo(User, {
            foreignKey: 'buyer_user_id',
            as: 'Buyer'
        });
        PaidInfo.hasOne(Delivery, {
            foreignKey: 'paid_info_id'
        });
        PaidInfo.hasOne(Chat, {
            foreignKey: 'paid_info_id'
        });
        PaidInfo.hasOne(Cancel, {
            foreignKey: 'paid_info_id'
        });
    }

    static associations: {
        PaymentMethodOption: Association<PaidInfo, PaymentMethodOption>;
        Item: Association<PaidInfo, Item>;
        ColorSize: Association<PaidInfo, ColorSize>;
        Delivery: Association<PaidInfo, Delivery>;
        User: Association<PaidInfo, User>;
        Chat: Association<PaidInfo, Chat>;
        Cancel: Association<PaidInfo, Cancel>;
    };
}

PaidInfo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        price: DataTypes.INTEGER,
        total_amount: DataTypes.INTEGER,
        points_used: DataTypes.INTEGER,
        sales_commission_amount: DataTypes.INTEGER,
        gain_amount: DataTypes.INTEGER,
        item_count: DataTypes.INTEGER,
        paid_ok: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        trans_finish: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        cancel: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        return_item: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        payment_method_id: DataTypes.INTEGER,
        item_id: DataTypes.INTEGER,
        color_size_id: DataTypes.INTEGER,
        seller_user_id: DataTypes.INTEGER,
        buyer_user_id: DataTypes.INTEGER,
        buy_date: DataTypes.DATE,
        paid_date: DataTypes.DATE,
        pay_id: {
            type: DataTypes.STRING(50),
            unique: true,
        },
        item_name: DataTypes.STRING(255),
        item_image: DataTypes.TEXT,
    },
    {
        sequelize,
        modelName: "PaidInfo",
        tableName: "paid_info",
        freezeTableName: true,
        timestamps: true,
    }
);

export default PaidInfo;