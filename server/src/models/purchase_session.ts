import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import Address from "./address.js";
import CouponUser from "./coupon_user.js";
import Item from "./item.js";
import Name from "./name.js";
import PaymentMethodOption from "./payment_method_option.js";
import User from "./user.js";

type SelectedVariant = {
    color?: string;
    size?: string;
    [key: string]: string | undefined;
};

export class PurchaseSession extends Model {
    declare id: number;
    declare buyer_user_id: number;
    declare item_id: number;
    declare address_id: number;
    declare name_id: number;
    declare coupon_user_id: number | null;
    declare buyer_phone_number: string | null;
    declare item_count: number | null; // 購入個数
    declare points_used: number | null; // ポイント払い額
    declare payment_method_id: number | null;
    declare selected_variant: SelectedVariant;
    declare arrive_specified_date: Date | null;
    declare expires_at: Date;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        PurchaseSession.belongsTo(User, {
            foreignKey: "buyer_user_id",
        });
        PurchaseSession.belongsTo(Item, {
            foreignKey: "item_id",
        });
        PurchaseSession.belongsTo(Address, {
            foreignKey: "address_id",
        });
        PurchaseSession.belongsTo(Name, {
            foreignKey: "name_id",
        });
        PurchaseSession.belongsTo(CouponUser, {
            foreignKey: "coupon_user_id",
        });
        PurchaseSession.belongsTo(PaymentMethodOption, {
            foreignKey: "payment_method_id",
        });
    }

    static associations: {
        User: Association<PurchaseSession, User>;
        Item: Association<PurchaseSession, Item>;
        Address: Association<PurchaseSession, Address>;
        Name: Association<PurchaseSession, Name>;
        CouponUser: Association<PurchaseSession, CouponUser>;
        PaymentMethodOption: Association<PurchaseSession, PaymentMethodOption>;
    };
}

PurchaseSession.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        buyer_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        address_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        coupon_user_id: DataTypes.INTEGER,
        buyer_phone_number: DataTypes.STRING,
        item_count: DataTypes.INTEGER,
        points_used: DataTypes.INTEGER,
        payment_method_id: DataTypes.INTEGER,
        selected_variant: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        arrive_specified_date: DataTypes.DATE,
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "PurchaseSession",
        tableName: "purchase_session",
        freezeTableName: true,
        timestamps: true,
    },
);

export default PurchaseSession;
