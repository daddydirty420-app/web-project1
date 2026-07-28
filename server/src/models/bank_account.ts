import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import ShopInfo from "./shop_info.js";
import ShopInfoEdit from "./shop_info_edit.js";
import Transfer from "./transfer.js";
import User from "./user.js";

export class BankAccount extends Model {
    declare id: number;
    declare bank_name: string | null;
    declare branch: string | null;
    declare account_number: string | null;
    declare meigi: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare bank_code: string | null;
    declare branch_code: string | null;
    declare account_type: "ordinary" | "checking" | "savings";

    static associate() {
        BankAccount.hasOne(ShopInfo, {
            foreignKey: "account_id",
        });
        BankAccount.hasOne(Transfer, {
            foreignKey: "account_id",
        });
        BankAccount.hasOne(User, {
            foreignKey: "account_id",
        });
        BankAccount.hasOne(ShopInfoEdit, {
            foreignKey: "account_id",
        });
    }

    static associations: {
        ShopInfo: Association<BankAccount, ShopInfo>;
        ShopInfoEdit: Association<BankAccount, ShopInfoEdit>;
        Transfer: Association<BankAccount, Transfer>;
        User: Association<BankAccount, User>;
    };
}

BankAccount.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        bank_name: DataTypes.STRING(255),
        branch: DataTypes.STRING(255),
        account_number: DataTypes.STRING(255),
        meigi: DataTypes.STRING(255),
        bank_code: DataTypes.STRING(20),
        branch_code: DataTypes.STRING(20),
        account_type: DataTypes.ENUM("ordinary", "checking", "savings"),
    },
    {
        sequelize,
        modelName: "BankAccount",
        tableName: "bank_account",
        freezeTableName: true,
        timestamps: true,
    },
);

export default BankAccount;
