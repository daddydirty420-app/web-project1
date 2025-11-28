import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";
import ShopInfo from "./shop_info.js";
import ComOrFreeOption from "./com_or_free_option.js";
import Address from "./address.js";
import Name from "./name.js";

export class ShopInfoEdit extends Model {
    declare id: number;
    declare company_name: string | null;
    declare company_number: string | null;
    declare id_card_front: string | null;
    declare id_card_rear: string | null;
    declare user_id: number | null;
    declare shop_info_id: number | null;
    declare com_or_free_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        ShopInfoEdit.belongsTo(User, {
            foreignKey: 'user_id'
        });
        ShopInfoEdit.belongsTo(ShopInfo, {
            foreignKey: 'shop_info_id'
        });
        ShopInfoEdit.belongsTo(ComOrFreeOption, {
            foreignKey: 'com_or_free_id'
        });
        ShopInfoEdit.hasOne(Address, {
            foreignKey: 'shop_info_edit_id'
        });
        ShopInfoEdit.hasOne(Name, {
            foreignKey: 'shop_info_edit_id'
        });
    }

    static associations: {
        User: Association<ShopInfoEdit, User>;
        ShopInfo: Association<ShopInfoEdit, ShopInfo>;
        ComOrFreeOption: Association<ShopInfoEdit, ComOrFreeOption>;
        Address: Association<ShopInfoEdit, Address>;
        Name: Association<ShopInfoEdit, Name>;
    };
}

ShopInfoEdit.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        company_name: DataTypes.STRING(255),
        company_number: DataTypes.STRING(20),
        id_card_front: DataTypes.TEXT,
        id_card_rear: DataTypes.TEXT,
        user_id: DataTypes.INTEGER,
        shop_info_id: DataTypes.INTEGER,
        com_or_free_id: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: "ShopInfoEdit",
        tableName: "shop_info_edit",
        freezeTableName: true,
        timestamps: true,
    }
);

export default ShopInfoEdit;