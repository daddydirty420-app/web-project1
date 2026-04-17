import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class ItemConditionOption extends Model {
    declare id: number;
    declare name: string;
}

ItemConditionOption.init(
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
        modelName: 'ItemConditionOption',
        tableName: 'item_condition_option',
        freezeTableName: true,
        timestamps: false,
    },
);

export default ItemConditionOption;
