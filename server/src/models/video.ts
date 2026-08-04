import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";
import Item from "./item.js";

export class Video extends Model {
    declare id: number;
    declare thumbnail_url: string | null;
    declare title: string | null;
    declare summary: string | null;
    declare duration: number | null;
    declare play_count: number;
    declare user_id: number | null;
    declare item_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare original_url: string | null;
    declare converted_url: string | null;
    declare status: string | null;

    static associate() {
        Video.belongsTo(User, {
            foreignKey: "user_id",
        });
        Video.belongsTo(Item, {
            foreignKey: "item_id",
        });
    }

    static associations: {
        User: Association<Video, User>;
        Item: Association<Video, Item>;
    };
}

Video.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        thumbnail_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        summary: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        play_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
            references: {
                model: "item",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        original_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        converted_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING(255),
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
        modelName: "Video",
        tableName: "video",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Video;
