import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db.js';

import User from './user.js';
import Item from './item.js';

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
            foreignKey: 'user_id',
        });
        Video.belongsTo(Item, {
            foreignKey: 'item_id',
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
        thumbnail_url: DataTypes.TEXT,
        title: DataTypes.STRING(255),
        summary: DataTypes.TEXT,
        duration: DataTypes.INTEGER,
        play_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        user_id: DataTypes.INTEGER,
        item_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
        original_url: DataTypes.TEXT,
        converted_url: DataTypes.TEXT,
        status: DataTypes.STRING(255),
    },
    {
        sequelize,
        modelName: 'Video',
        tableName: 'video',
        freezeTableName: true,
        timestamps: true,
    },
);

export default Video;
