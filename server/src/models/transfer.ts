import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import TransReasonOption from "./trans_reason_option.js";
import User from "./user.js";
import BankAccount from "./bank_account.js";

export class Transfar extends Model {
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
    declare transfar_id: string | null;

    static associate() {
        Transfar.belongsTo(TransReasonOption, {
            foreignKey: 'trans_reason_id'
        });
        Transfar.belongsTo(User, {
            foreignKey: 'user_id'
        });
        Transfar.hasOne(BankAccount, {
            foreignKey: 'transfar_id'
        });
    }

    static associations: {
        TransReasonOption: Association<Transfar, TransReasonOption>;
        User: Association<Transfar, User>;
        BankAccount: Association<Transfar, BankAccount>;
    };
}

Transfar.init(
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
            defaultValue: false
        },
        user_id: DataTypes.INTEGER,
        trans_schedule_date: DataTypes.DATE,
        trans_at: DataTypes.DATE,
        transfar_id: {
            type: DataTypes.STRING(50),
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "Transfar",
        tableName: "transfar",
        freezeTableName: true,
        timestamps: true,
    }
);

export default Transfar;