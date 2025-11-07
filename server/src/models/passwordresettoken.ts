import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class PasswordResetTokens extends Model {
    declare id: number;
    declare token_hash: string;
    declare expires_at: Date;
    declare user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        PasswordResetTokens.belongsTo(User, {
            foreignKey: 'user_id',
        });
    };

    static associations: {
        User: Association<PasswordResetTokens, User>;
    };
}

PasswordResetTokens.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        token_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,
        timestamps: true,
    }
);

export default PasswordResetTokens;