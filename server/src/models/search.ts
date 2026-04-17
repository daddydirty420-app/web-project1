import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class Search extends Model {
    declare id: number;
    declare search_text: string | null;
    declare category_text: string | null;
    declare user_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Search.belongsTo(User, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        User: Association<Search, User>;
    };
}

Search.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        search_text: DataTypes.TEXT,
        category_text: DataTypes.STRING(255),
        user_id: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: "Search",
        tableName: "search",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Search;
