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
            foreignKey: 'seller_user_id',
            as: 'Seller'
        });
        StarHistory.belongsTo(User, {
            foreignKey: 'buyer_user_id',
            as: 'Buyer'
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
        star: DataTypes.INTEGER,
        seller_user_id: DataTypes.INTEGER,
        buyer_user_id: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: "StarHistory",
        tableName: "star_history",
        freezeTableName: true,
        timestamps: true,
    }
);

export default StarHistory;