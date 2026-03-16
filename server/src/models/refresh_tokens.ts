import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class RefreshTokens extends Model {
    declare id: number;
    declare token: string;
    declare user_id: number;
    declare expires_at: Date;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        RefreshTokens.belongsTo(User, {
            foreignKey: "user_id",
        });
    };

    static associations: { 
        User: Association<RefreshTokens, User>;
     };
};

RefreshTokens.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        token: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
    },
    {
        sequelize,
        modelName: "RefreshTokens",
        tableName: "refresh_tokens",
        freezeTableName: true,
        timestamps: true,
    },
);

export default RefreshTokens;