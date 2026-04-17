import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class TransReasonOption extends Model {
    declare id: number;
    declare name: string;
}

TransReasonOption.init(
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
        modelName: 'TransReasonOption',
        tableName: 'trans_reason_option',
        freezeTableName: true,
        timestamps: false,
    },
);

export default TransReasonOption;
