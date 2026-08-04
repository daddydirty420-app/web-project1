import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class TokenPasswordReset extends Model {
    declare id: number;
    declare token_hash: string;
    declare expires_at: Date;
    declare user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        TokenPasswordReset.belongsTo(User, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        User: Association<TokenPasswordReset, User>;
    };
}

TokenPasswordReset.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        token_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
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
        modelName: "TokenPasswordReset",
        tableName: "token_password_reset",
        freezeTableName: true,
        timestamps: true,
    },
);

export default TokenPasswordReset;
