import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class PointsHistory extends Model {
    declare id: number;
    declare points: number | null;
    declare used_points: number | null;
    declare user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        PointsHistory.belongsTo(User, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        User: Association<PointsHistory, User>;
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
        points: DataTypes.INTEGER,
        used_points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
