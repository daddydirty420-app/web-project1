import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";
import type { PurchaseSnapshot } from "../types/purchaseSnapshot.js";

import PaymentMethodOption from "./payment_method_option.js";
import Item from "./item.js";
import Delivery from "./delivery.js";
import User from "./user.js";
import Chat from "./chat.js";
import Cancel from "./cancel.js";

export class PaidInfo extends Model {
    declare id: number;
    declare unit_price: number | null; // 1点当たりの金額
    declare item_count: number | null; // 個数
    declare subtotal_amount: number | null; // unit_price × item_count
    declare discount_amount: number | null; // 割引（クーポン等）
    declare total_amount: number | null; // ポイントを含む合計支払金額
    declare points_used: number | null; // ポイント払い
    declare paid_amount: number | null; // ポイントを除く合計支払金額
    declare sales_commission_amount: number | null; // 販売手数料
    declare gain_amount: number | null; // 出品者売上金
    declare payment_method_id: number | null;
    declare item_id: number | null;
    declare seller_user_id: number | null;
    declare buyer_user_id: number | null;
    declare buy_date: Date | null;
    declare paid_date: Date | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare pay_id: string | null; // 22文字、crypto.randomBytes(16).toString("base64url");
    declare status: "pending" | "paid" | "shipped" | "completed" | "cancelled" | "returned";
    declare purchase_snapshot: PurchaseSnapshot;

    static associate() {
        PaidInfo.belongsTo(PaymentMethodOption, {
            foreignKey: 'payment_method_id'
        });
        PaidInfo.belongsTo(Item, {
            foreignKey: 'item_id'
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
    };

    static associations: {
        PaymentMethodOption: Association<PaidInfo, PaymentMethodOption>;
        Item: Association<PaidInfo, Item>;
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
        unit_price: DataTypes.INTEGER, // 1点当たり
        item_count: DataTypes.INTEGER, // 個数
        subtotal_amount: DataTypes.INTEGER, // 小計
        discount_amount: DataTypes.INTEGER, // クーポン等
        total_amount: DataTypes.INTEGER, //　ポイント込み合計請求金額
        points_used: DataTypes.INTEGER, // ポイント利用
        paid_amount: DataTypes.INTEGER, //　ポイント除外合計請求金額
        sales_commission_amount: DataTypes.INTEGER, // 販売手数料
        gain_amount: DataTypes.INTEGER, //出品者売上金
        payment_method_id: DataTypes.INTEGER,
        item_id: DataTypes.INTEGER,
        seller_user_id: DataTypes.INTEGER,
        buyer_user_id: DataTypes.INTEGER,
        buy_at: DataTypes.DATE,
        paid_at: DataTypes.DATE,
        pay_id: {
            type: DataTypes.STRING(50),
            unique: true,
        },
        status: {
            type: DataTypes.ENUM("pending", "paid", "shipped", "completed", "cancelled", "returned"),
            allowNull: false,
            defaultValue: "pending",
        },
        purchase_snapshot: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
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