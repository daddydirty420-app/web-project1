import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class EmailChangeTokens extends Model {
    declare id: number;
    declare token_hash: string;
    declare expires_at: Date;
    declare user_id: number;
    declare new_email: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        EmailChangeTokens.belongsTo(User, {
            foreignKey: "user_id",
        });
    };

    static associations: {
        User: Association<EmailChangeTokens, User>;
    };
};

EmailChangeTokens.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        token_hash: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        new_email: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
    },
);

export default EmailChangeTokens;