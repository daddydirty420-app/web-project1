import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

export class SearchWords extends Model {
    declare id: number;
    declare word: string;
    declare count: number;
    declare createdAt: Date;
    declare updatedAt: Date;
};

SearchWords.init(
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
        count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    },
    {
        sequelize,
        timestamps: true,
    }
);

export default SearchWords;