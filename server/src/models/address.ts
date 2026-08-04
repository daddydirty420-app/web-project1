import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import Delivery from "./delivery.js";
import ShopInfo from "./shop_info.js";
import ShopInfoEdit from "./shop_info_edit.js";
import TodouhukenOption from "./todouhuken_option.js";
import User from "./user.js";
import PurchaseSession from "./purchase_session.js";

export class Address extends Model {
    declare id: number;
    declare post_number: string | null;
    declare todouhuken_id: number | null;
    declare shikutyouson: string | null;
    declare banchi: string | null;
    declare building: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Address.belongsTo(TodouhukenOption, {
            foreignKey: "todouhuken_id",
            as: "AddressTodouhuken",
        });
        Address.hasOne(ShopInfo, {
            foreignKey: "address_id",
        });
        Address.hasOne(ShopInfoEdit, {
            foreignKey: "address_id",
        });
        Address.hasOne(Delivery, {
            foreignKey: "address_id",
        });
        Address.hasOne(User, {
            foreignKey: "address_id",
        });
        Address.hasOne(PurchaseSession, {
            foreignKey: "address_id",
        });
    }

    static associations: {
        AddressTodouhuken: Association<Address, TodouhukenOption>;
        ShopInfo: Association<Address, ShopInfo>;
        ShopInfoEdit: Association<Address, ShopInfoEdit>;
        Delivery: Association<Address, Delivery>;
        User: Association<Address, User>;
        PurchaseSession: Association<Address, PurchaseSession>;
    };
}

Address.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        post_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        todouhuken_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "todouhuken_option",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        shikutyouson: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        banchi: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        building: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "Address",
        tableName: "address",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Address;
