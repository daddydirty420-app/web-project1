import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db.js';

import ShopInfo from './shop_info.js';
import AccountTypeOption from './account_type_option.js';
import Transfer from './transfer.js';
import User from './user.js';
import ShopInfoEdit from './shop_info_edit.js';

export class BankAccount extends Model {
    declare id: number;
    declare bank_name: string | null;
    declare branch: string | null;
    declare account_type_id: number | null;
    declare account_number: string | null;
    declare meigi: string | null;
    declare user_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare shop_info_id: number | null;
    declare transfer_id: number | null;
    declare bank_code: string | null;
    declare branch_code: string | null;
    declare shop_info_edit_id: number | null;

    static associate() {
        BankAccount.belongsTo(ShopInfo, {
            foreignKey: 'shop_info_id',
        });
        BankAccount.belongsTo(AccountTypeOption, {
            foreignKey: 'account_type_id',
        });
        BankAccount.belongsTo(Transfer, {
            foreignKey: 'transfer_id',
        });
        BankAccount.belongsTo(User, {
            foreignKey: 'user_id',
        });
        BankAccount.belongsTo(ShopInfoEdit, {
            foreignKey: 'shop_info_edit_id',
        });
    }

    static associations: {
        ShopInfo: Association<BankAccount, ShopInfo>;
        ShopInfoEdit: Association<BankAccount, ShopInfoEdit>;
        AccountTypeOption: Association<BankAccount, AccountTypeOption>;
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
        account_type_id: DataTypes.INTEGER,
        account_number: DataTypes.STRING(255),
        meigi: DataTypes.STRING(255),
        user_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
        shop_info_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
        transfer_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
        bank_code: DataTypes.STRING(20),
        branch_code: DataTypes.STRING(20),
        shop_info_edit_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: 'BankAccount',
        tableName: 'bank_account',
        freezeTableName: true,
        timestamps: true,
    },
);

export default BankAccount;
