import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import { BankSnapshot } from "../types/bankSnapshot.js";
import TransReasonOption from "./trans_reason_option.js";
import User from "./user.js";

export class Transfer extends Model {
    declare id: number;
    declare request_money: number | null;
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
    declare bank_snapshot: BankSnapshot;

    static associate() {
        Transfer.belongsTo(TransReasonOption, {
            foreignKey: "trans_reason_id",
        });
        Transfer.belongsTo(User, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        TransReasonOption: Association<Transfer, TransReasonOption>;
        User: Association<Transfer, User>;
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
        request_money: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        handling_charge: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        trans_money: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        trans_reason_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "trans_reason_option",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
        },
        trans_finish: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        trans_schedule_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        trans_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        transfer_id: {
            type: DataTypes.STRING(50),
            allowNull: true,
            unique: true,
        },
        bank_snapshot: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
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
        modelName: "Transfer",
        tableName: "transfer",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Transfer;
