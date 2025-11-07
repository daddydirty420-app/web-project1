import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import TodouhukenOption from "./todouhuken_option.js";
import ShopInfo from "./shop_info.js";
import ShopInfoEdit from "./shop_info_edit.js";
import Delivery from "./delivery.js";
import User from "./user.js";

export class Address extends Model {
    declare id: number;
    declare post_number: string | null;
    declare todouhuken_id: number | null;
    declare sikutyouson: string | null;
    declare banchi: string | null;
    declare building: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare shop_info_id: number | null;
    declare shop_info_edit_id: number | null;
    declare delivery_id: number | null;
    declare user_id: number | null;

    static associate() {
        Address.belongsTo(TodouhukenOption, {
            foreignKey: "todouhuken_id",
            as: "AddressTodouhuken",
        });
        Address.belongsTo(ShopInfo, {
            foreignKey: "shop_info_id",
        });
        Address.belongsTo(ShopInfoEdit, {
            foreignKey: "shop_info_edit_id",
        });
        Address.belongsTo(Delivery, {
            foreignKey: "delivery_id",
        });
        Address.belongsTo(User, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        AddressTodouhuken: Association<Address, TodouhukenOption>;
        ShopInfo: Association<Address, ShopInfo>;
        ShopInfoEdit: Association<Address, ShopInfoEdit>;
        Delivery: Association<Address, Delivery>;
        User: Association<Address, User>;
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
        post_number: DataTypes.TEXT,
        todouhuken_id: DataTypes.INTEGER,
        shikutyouson: DataTypes.TEXT,
        banchi: DataTypes.TEXT,
        building: DataTypes.TEXT,
        shop_info_id: DataTypes.INTEGER,
        shop_info_edit_id: DataTypes.INTEGER,
        delivery_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: "Address",
        tableName: "address",
        freezeTableName: true,
        timestamps: true,
    }
);

export default Address;