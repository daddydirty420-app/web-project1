import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class ComOrFreeOption extends Model {
    declare id: number;
    declare name: string;
}

ComOrFreeOption.init(
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
        modelName: 'ComOrFreeOption',
        tableName: 'com_or_free_option',
        freezeTableName: true,
        timestamps: false,
    },
);

export default ComOrFreeOption;
