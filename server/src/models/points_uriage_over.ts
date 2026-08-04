import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

export class PointsUriageOver extends Model {
    declare id: number;
    declare points_180: number | null;
    declare uriagekin_180: number | null;
    declare points_confiscated: number | null;
    declare uriagekin_confiscated: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;
}

PointsUriageOver.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        points_180: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        uriagekin_180: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        points_confiscated: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        uriagekin_confiscated: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        modelName: "PointsUriageOver",
        tableName: "points_uriage_over",
        freezeTableName: true,
        timestamps: true,
    },
);

export default PointsUriageOver;
