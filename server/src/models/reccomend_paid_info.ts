import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import ReccomendMonth from "./reccomend_month.js";
import ReccomendItem from "./reccomend_item.js";
import User from "./user.js";

export class ReccomendPaidInfo extends Model {
    declare id: number;
    declare user_id: number;
    declare reccomend_month_id: number | null;
    declare price: number;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare reccomend_item_id: number | null;
    declare pay_id: string | null;

    static associate() {
        ReccomendPaidInfo.belongsTo(User, {
            foreignKey: 'user_id'
        });
        ReccomendPaidInfo.belongsTo(ReccomendMonth, {
            foreignKey: 'reccomend_month_id'
        });
        ReccomendPaidInfo.belongsTo(ReccomendItem, {
            foreignKey: 'reccomend_item_id'
        });
    }

    static associations: {
        User: Association<ReccomendPaidInfo, User>;
    };
}

ReccomendPaidInfo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reccomend_month_id: DataTypes.INTEGER,
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reccomend_item_id: DataTypes.INTEGER,
        pay_id: DataTypes.CHAR(20),
    },
    {
        sequelize,
        modelName: "ReccomendPaidInfo",
        tableName: "reccomend_paid_info",
        freezeTableName: true,
        timestamps: true,
    }
);

export default ReccomendPaidInfo;