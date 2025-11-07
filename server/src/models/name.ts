import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import ShopInfo from "./shop_info.js";
import ShopInfoEdit from "./shop_info_edit.js";
import Delivery from "./delivery.js";
import User from "./user.js";

export class Name extends Model {
    declare id: number;
    declare sei: string | null;
    declare mei: string | null;
    declare sei_kana: string | null;
    declare mei_kana: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare shop_info_id: number | null;
    declare shop_info_edit_id: number | null;
    declare delivery_id: number | null;
    declare user_id: number | null;

    static associate() {
        Name.belongsTo(ShopInfo, {
            foreignKey: 'shop_info_id'
        });
        Name.belongsTo(ShopInfoEdit, {
            foreignKey: 'shop_info_edit_id'
        });
        Name.belongsTo(Delivery, {
            foreignKey: 'delivery_id'
        });
        Name.belongsTo(User, {
            foreignKey: 'user_id'
        });
    }

    static associations: {
        ShopInfo: Association<Name, ShopInfo>;
        ShopInfoEdit: Association<Name, ShopInfoEdit>;
        Delivery: Association<Name, Delivery>;
        User: Association<Name, User>;
    };
}

Name.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        sei: DataTypes.TEXT,
        mei: DataTypes.TEXT,
        sei_kana: DataTypes.TEXT,
        mei_kana: DataTypes.TEXT,
        shop_info_id: DataTypes.INTEGER,
        shop_info_edit_id: DataTypes.INTEGER,
        delivery_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: "Name",
        tableName: "name",
        freezeTableName: true,
        timestamps: true,
    }
);

export default Name;