import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import PointReasonOption from "./point_reason_option.js";
import User from "./user.js";

export class PointsHistory extends Model {
    declare id: number;
    declare points: number | null;
    declare user_id: number;
    declare reason_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        PointsHistory.belongsTo(User, {
            foreignKey: "user_id",
        });
        PointsHistory.belongsTo(PointReasonOption, {
            foreignKey: "reason_id",
        });
    }

    static associations: {
        User: Association<PointsHistory, User>;
        PointReasonOption: Association<PointsHistory, PointReasonOption>;
    };
}

PointsHistory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
        },
        reason_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "point_reason_option",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
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
        modelName: "PointsHistory",
        tableName: "points_history",
        freezeTableName: true,
        timestamps: true,
    },
);

export default PointsHistory;
