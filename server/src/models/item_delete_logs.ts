import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db.js';

import Item from './item.js';
import User from './user.js';

export class ItemDeleteLogs extends Model {
    declare id: number;
    declare item_id: number;
    declare delete_user_id: number;
    declare delete_by_admin: boolean;
    declare delete_reason: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        ItemDeleteLogs.belongsTo(Item, {
            foreignKey: 'item_id',
        });
        ItemDeleteLogs.belongsTo(User, {
            foreignKey: 'delete_user_id',
        });
    }

    static associations: {
        Item: Association<ItemDeleteLogs, Item>;
        User: Association<ItemDeleteLogs, User>;
    };
}

ItemDeleteLogs.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        delete_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        delete_by_admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        delete_reason: DataTypes.TEXT,
    },
    {
        sequelize,
        modelName: 'ItemDeleteLogs',
        tableName: 'item_delete_logs',
        freezeTableName: true,
        timestamps: true,
    },
);

export default ItemDeleteLogs;
