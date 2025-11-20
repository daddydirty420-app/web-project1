import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";
import ComOrFreeOption from "./com_or_free_option.js";
import Address from "./address.js";
import Name from "./name.js";
import BankAccount from "./bank_account.js";

export class ShopInfo extends Model {
    declare id: number;
    declare company_name: string | null;
    declare shop_name: string | null;
    declare email: string | null;
    declare phone_number: string | null;
    declare homepage_url: string | null;
    declare open_date_time: string | null;
    declare company_number: string | null;
    declare capital: number | null;
    declare menber_count: number | null;
    declare id_card_front: string | null;
    declare id_card_rear: string | null;
    declare request_all: boolean;
    declare verified: boolean;
    declare auto_trans: boolean;
    declare user_id: number | null;
    declare com_or_free_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare founded_date: Date | null;
    declare open_info: boolean;
    declare permit_url: string[] | null;

    static associate() {
        ShopInfo.belongsTo(User, {
            foreignKey: 'user_id'
        });
        ShopInfo.belongsTo(ComOrFreeOption, {
            foreignKey: 'com_or_free_id'
        });
        ShopInfo.hasOne(Address, {
            foreignKey: 'shop_info_id'
        });
        ShopInfo.hasOne(Name, {
            foreignKey: 'shop_info_id'
        });
        ShopInfo.hasOne(BankAccount, {
            foreignKey: 'shop_info_id'
        });
    }

    static associations: {
        User: Association<ShopInfo, User>;
        ComOrFreeOption: Association<ShopInfo, ComOrFreeOption>;
        Address: Association<ShopInfo, Address>;
        Name: Association<ShopInfo, Name>;
        BankAccount: Association<ShopInfo, BankAccount>;
    };
}

ShopInfo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        company_name: DataTypes.TEXT,
        shop_name: DataTypes.TEXT,
        email: DataTypes.TEXT,
        phone_number: DataTypes.TEXT,
        homepage_url: DataTypes.TEXT,
        open_date_time: DataTypes.TEXT,
        company_number: DataTypes.TEXT,
        capital: DataTypes.DECIMAL,
        menber_count: DataTypes.INTEGER,
        id_card_front: DataTypes.TEXT,
        id_card_rear: DataTypes.TEXT,
        request_all: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        auto_trans: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        user_id: DataTypes.INTEGER,
        com_or_free_id: DataTypes.INTEGER,
        founded_date: DataTypes.DATE,
        open_info: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
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
        modelName: "ShopInfo",
        tableName: "shop_info",
        freezeTableName: true,
        timestamps: true,
    }
);

export default ShopInfo;