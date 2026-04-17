import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class JournalReasonOption extends Model {
    declare id: number;
    declare name: string;
}

JournalReasonOption.init(
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
        modelName: 'JournalReasonOption',
        tableName: 'journal_reason_option',
        freezeTableName: true,
        timestamps: false,
    },
);

export default JournalReasonOption;
