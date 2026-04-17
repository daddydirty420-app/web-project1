import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class GenderOption extends Model {
    declare id: number;
    declare name: string;
}

GenderOption.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'GenderOption',
        tableName: 'gender_option',
        freezeTableName: true,
        timestamps: false,
    },
);

export default GenderOption;
