import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class StarHistory extends Model {
    declare id: number;
    declare star: number | null;
    declare seller_user_id: number | null;
    declare buyer_user_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        StarHistory.belongsTo(User, {
            foreignKey: "seller_user_id",
            as: "Seller",
        });
        StarHistory.belongsTo(User, {
            foreignKey: "buyer_user_id",
            as: "Buyer",
        });
    }

    static associations: {
        User: Association<StarHistory, User>;
    };
}

StarHistory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        star: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        seller_user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        buyer_user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
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
        modelName: "StarHistory",
        tableName: "star_history",
        freezeTableName: true,
        timestamps: true,
    },
);

export default StarHistory;
