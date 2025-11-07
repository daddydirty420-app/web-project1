import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class ReccomendMonth extends Model {
    declare id: number;
    declare paid: boolean;
    declare will_cancel: boolean;
    declare user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        ReccomendMonth.belongsTo(User, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        User: Association<ReccomendMonth, User>;
    };
}

ReccomendMonth.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        paid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        will_cancel: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        user_id: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: "ReccomendMonth",
        tableName: "reccomend_month",
        freezeTableName: true,
        timestamps: true,
    }
);

export default ReccomendMonth;