import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import TransReasonOption from "./trans_reason_option.js";
import User from "./user.js";
import BankAccount from "./bank_account.js";

export class Transfer extends Model {
    declare id: number;
    declare all_money: number | null;
    declare handling_charge: number | null;
    declare trans_money: number | null;
    declare trans_reason_id: number | null;
    declare trans_finish: boolean;
    declare user_id: number | null;
    declare trans_schedule_date: Date | null;
    declare trans_date: Date | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare transfer_id: string | null;

    static associate() {
        Transfer.belongsTo(TransReasonOption, {
            foreignKey: "trans_reason_id",
        });
        Transfer.belongsTo(User, {
            foreignKey: "user_id",
        });
        Transfer.hasOne(BankAccount, {
            foreignKey: "transfer_id",
        });
    }

    static associations: {
        TransReasonOption: Association<Transfer, TransReasonOption>;
        User: Association<Transfer, User>;
        BankAccount: Association<Transfer, BankAccount>;
    };
}

Transfer.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        all_money: DataTypes.INTEGER,
        handling_charge: DataTypes.INTEGER,
        trans_money: DataTypes.INTEGER,
        trans_reason_id: DataTypes.INTEGER,
        trans_finish: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        user_id: DataTypes.INTEGER,
        trans_schedule_date: DataTypes.DATE,
        trans_at: DataTypes.DATE,
        transfer_id: {
            type: DataTypes.STRING(50),
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "Transfer",
        tableName: "transfer",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Transfer;
