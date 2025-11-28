import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import Item from "./item.js";

export class SuggestWords extends Model {
    declare id: number;
    declare word: string;
    declare item_id: number;
    declare type: "title" | "tag" | "category" | "user" | "video";
    declare createdAt: Date;
    declare updatedAt: Date;
    
    static associate() {
        SuggestWords.belongsTo(Item, {
            foreignKey: "item_id",
            onDelete: "CASCADE",
        });
    };

    static associations: {
        Item: Association<SuggestWords, Item>;
    };        
};

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
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Item,
                key: "id",
            },
        },
        type: {
            type: DataTypes.ENUM("title", "tag", "category", "user", "video"),
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
    },
);

export default SuggestWords;