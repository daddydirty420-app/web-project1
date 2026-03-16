import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";
import Comment from "./comment.js";

export class CommentLike extends Model {
    declare id: number;
    declare comment_id: number;
    declare user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        CommentLike.belongsTo(Comment, {
            foreignKey: "comment_id",
        });
        CommentLike.belongsTo(User, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        Comment: Association<CommentLike, Comment>;
        User: Association<CommentLike, User>;
    };
}

CommentLike.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        comment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "CommentLike",
        tableName: "comment_like",
        freezeTableName: true,
        timestamps: true,
    }
);

export default CommentLike;