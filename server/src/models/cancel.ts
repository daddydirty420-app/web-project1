import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import CancelFeeReturnOption from "./cancel_fee_return_option.js";
import PaidInfo from "./paid_info.js";

export class Cancel extends Model {
    declare id: number;
    declare cancel_reason: string | null;
    declare return_amount: number | null;
    declare item_count: number | null;
    declare cancel_flag: boolean;
    declare cancel_fee_return_id: number | null;
    declare paid_info_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Cancel.belongsTo(CancelFeeReturnOption, {
            foreignKey: "cancel_fee_return_id",
        });
        Cancel.belongsTo(PaidInfo, {
            foreignKey: "paid_info_id",
        });
    }

    static associations: {
        CancelFeeReturnOption: Association<Cancel, CancelFeeReturnOption>;
        PaidInfo: Association<Cancel, PaidInfo>;
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
        },
        cancel_fee_return_id: DataTypes.INTEGER,
        paid_info_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "Cancel",
        tableName: "cancel",
        freezeTableName: true,
        timestamps: true,
    }
);

export default Cancel;