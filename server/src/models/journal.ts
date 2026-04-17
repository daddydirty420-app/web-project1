import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db.js';

import KanjyoOption from './kanjyo_option.js';
import JournalReasonOption from './journal_reason_option.js';

export class Journal extends Model {
    declare id: number;
    declare kanjyo_kari1: number | null;
    declare kanjyo_kari2: number | null;
    declare kanjyo_kashi1: number | null;
    declare kanjyo_kashi2: number | null;
    declare reason_id: number | null;
    declare price_kari1: number | null;
    declare price_kari2: number | null;
    declare price_kashi1: number | null;
    declare price_kashi2: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Journal.belongsTo(KanjyoOption, {
            foreignKey: 'kanjyo_kari1',
            as: 'Kari1',
        });
        Journal.belongsTo(KanjyoOption, {
            foreignKey: 'kanjyo_kari2',
            as: 'Kari2',
        });
        Journal.belongsTo(KanjyoOption, {
            foreignKey: 'kanjyo_kashi1',
            as: 'Kashi1',
        });
        Journal.belongsTo(KanjyoOption, {
            foreignKey: 'kanjyo_kashi2',
            as: 'Kashi2',
        });
        Journal.belongsTo(JournalReasonOption, {
            foreignKey: 'reason_id',
        });
    }

    static associations: {
        KanjyoOption: Association<Journal, KanjyoOption>;
        JournalReasonOption: Association<Journal, JournalReasonOption>;
    };
}

Journal.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        kanjyo_kari1: DataTypes.INTEGER,
        kanjyo_kari2: DataTypes.INTEGER,
        kanjyo_kashi1: DataTypes.INTEGER,
        kanjyo_kashi2: DataTypes.INTEGER,
        reason_id: DataTypes.INTEGER,
        price_kari1: DataTypes.INTEGER,
        price_kari2: DataTypes.INTEGER,
        price_kashi1: DataTypes.INTEGER,
        price_kashi2: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: 'Journal',
        tableName: 'journal',
        freezeTableName: true,
        timestamps: true,
    },
);

export default Journal;
