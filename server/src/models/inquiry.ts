import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class Inquiry extends Model {
    declare id: number;
    declare email: string;
    declare name: string;
    declare title: string;
    declare body: string;
    declare user_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Inquiry.belongsTo(User, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        User: Association<Inquiry, User>;
    };
}

Inquiry.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
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
        modelName: "Inquiry",
        tableName: "inquiry",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Inquiry;
