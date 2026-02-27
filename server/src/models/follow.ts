import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class Follow extends Model {
    declare id: number;
    declare follow_user_id: number;
    declare follower_user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Follow.belongsTo(User, {
            foreignKey: "follow_user_id",
            as: "FollowUser", // フォローしている
        });
        Follow.belongsTo(User, {
            foreignKey: "follower_user_id",
            as: "FollowerUser", // フォローされている
        });
    }

    static associations: {
        User: Association<Follow, User>;
    };
}

Follow.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        follow_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        follower_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Follow",
        tableName: "follow",
        freezeTableName: true,
        timestamps: true,
    }
);

export default Follow;