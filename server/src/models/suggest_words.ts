import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class SuggestWords extends Model {
    declare id: number;
    declare word: string;
    declare normalized_word: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;
}

SuggestWords.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        word: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        normalized_word: {
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
        modelName: "SuggestWords",
        tableName: "suggest_words",
        freezeTableName: true,
        timestamps: true,
    },
);

export default SuggestWords;
