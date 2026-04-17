import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db.js';

import Item from './item.js';
import User from './user.js';
import ItemReportOption from './item_report_option.js';

export class ItemReport extends Model {
    declare id: number;
    declare item_id: number;
    declare report_user_id: number;
    declare option_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        ItemReport.belongsTo(Item, {
            foreignKey: 'item_id',
        });
        ItemReport.belongsTo(User, {
            foreignKey: 'report_user_id',
        });
        ItemReport.belongsTo(ItemReportOption, {
            foreignKey: 'option_id',
        });
    }

    static associations: {
        Item: Association<ItemReport, Item>;
        User: Association<ItemReport, User>;
        ItemBuyerReportOption: Association<ItemReport, ItemReportOption>;
    };
}

ItemReport.init(
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
        report_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        option_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'ItemReport',
        tableName: 'item_report',
        freezeTableName: true,
        timestamps: true,
    },
);

export default ItemReport;
