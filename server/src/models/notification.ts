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
    declare type: string;

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
        message_image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        read_flag: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        read_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
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
        modelName: "Notification",
        tableName: "notification",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Notification;
