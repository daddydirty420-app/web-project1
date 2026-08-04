import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

export class PointReasonOption extends Model {
    declare id: number;
    declare name: string;
}

PointReasonOption.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "PointReasonOption",
        tableName: "point_reason_option",
        freezeTableName: true,
        timestamps: false,
    },
);

export default PointReasonOption;
