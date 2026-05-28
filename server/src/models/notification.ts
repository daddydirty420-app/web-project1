import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class Notification extends Model {
    declare id: number;
    declare message: string;
    declare message_image: string | null;
    declare read_flag: boolean;
    declare read_user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare url: string | null;
    declare expires_at: Date | null;

    static associate() {
        Notification.belongsTo(User, {
            foreignKey: "read_user_id",
        });
    }

    static associations: {
        User: Association<Notification, User>;
    };
}

Notification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        message_image: DataTypes.TEXT,
        read_flag: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        read_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        url: DataTypes.TEXT,
        expires_at: DataTypes.DATE,
    },
    {
        sequelize,
        modelName: "Notification",
        tableName: "notification",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Notification;
