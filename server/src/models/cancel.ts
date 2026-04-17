import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db.js';

import CancelFeeReturnOption from './cancel_fee_return_option.js';
import Orders from './orders.js';

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
            foreignKey: 'cancel_fee_return_id',
        });
        Cancel.belongsTo(Orders, {
            foreignKey: 'orders_id',
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
        cancel_reason: DataTypes.TEXT,
        return_amount: DataTypes.INTEGER,
        item_count: DataTypes.INTEGER,
        cancel_flag: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }, // false: 申請中, true: キャンセル確定
        cancel_fee_return_id: DataTypes.INTEGER,
        orders_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: 'Cancel',
        tableName: 'cancel',
        freezeTableName: true,
        timestamps: true,
    },
);

export default Cancel;
