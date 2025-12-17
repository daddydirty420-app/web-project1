import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";
import ShopInfo from "./shop_info.js";
import ComOrFreeOption from "./com_or_free_option.js";
import Address from "./address.js";
import Name from "./name.js";
import BankAccount from "./bank_account.js";

export class ShopInfoEdit extends Model {
    declare id: number;
    declare company_name: string | null;
    declare company_number: string | null;
    declare id_card_front: string | null;
    declare id_card_rear: string | null;
    declare phone_number: string | null;
    declare email: string | null;
    declare founded_date: Date | null;
    declare member_count: number | null;
    declare homepage_url: string | null;
    declare capital: number | null;
    declare open_date_time: string | null;
    declare user_id: number | null;
    declare shop_info_id: number | null;
    declare com_or_free_id: number | null;
    declare permit_url: string[] | null;
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
        ShopInfoEdit.hasOne(BankAccount, {
            foreignKey: 'shop_info_edit_id'
        });
    }

    static associations: {
        User: Association<ShopInfoEdit, User>;
        ShopInfo: Association<ShopInfoEdit, ShopInfo>;
        ComOrFreeOption: Association<ShopInfoEdit, ComOrFreeOption>;
        Address: Association<ShopInfoEdit, Address>;
        Name: Association<ShopInfoEdit, Name>;
        BankAccount: Association<ShopInfoEdit, BankAccount>;
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
        phone_number: DataTypes.STRING(20),
        email: DataTypes.STRING(255),
        founded_date: DataTypes.DATE,
        member_count: DataTypes.INTEGER,
        homepage_url: DataTypes.STRING,
        capital: DataTypes.DECIMAL,
        open_date_time: DataTypes.TEXT,
        user_id: DataTypes.INTEGER,
        shop_info_id: DataTypes.INTEGER,
        com_or_free_id: DataTypes.INTEGER,
        permit_url: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            validate: {
                maxArrayLength(value: any[]) {
                    if (value && value.length > 10) {
                        throw new Error("画像は最大10枚までです。");
                    }
                }
            }
        },
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