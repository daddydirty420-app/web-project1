import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import CancelFeeReturnOption from "./cancel_fee_return_option.js";
import Orders from "./orders.js";

export class Cancel extends Model {
    declare id: number;
    declare cancel_reason: string | null;
    declare return_amount: number | null;
    declare item_count: number | null;
    declare cancel_flag: boolean;
    declare cancel_fee_return_id: number | null;
    declare orders_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Cancel.belongsTo(CancelFeeReturnOption, {
            foreignKey: "cancel_fee_return_id",
        });
        Cancel.belongsTo(Orders, {
            foreignKey: "orders_id",
        });
    }

    static associations: {
        CancelFeeReturnOption: Association<Cancel, CancelFeeReturnOption>;
        Orders: Association<Cancel, Orders>;
    };
}

Cancel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        cancel_reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        return_amount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        item_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cancel_flag: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }, // false: 申請中, true: キャンセル確定
        cancel_fee_return_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "cancel_fee_return_option",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
        },
        orders_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
            references: {
                model: "orders",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
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
        modelName: "Cancel",
        tableName: "cancel",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Cancel;
