import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";
import Comment from "./comment.js";

export class GoodComment extends Model {
    declare id: number;
    declare comment_id: number;
    declare good_user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        GoodComment.belongsTo(Comment, {
            foreignKey: "comment_id",
        });
        GoodComment.belongsTo(User, {
            foreignKey: "good_user_id",
        });
    }

    static associations: {
        Comment: Association<GoodComment, Comment>;
        User: Association<GoodComment, User>;
    };
}

GoodComment.init(
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
        good_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "GoodComment",
        tableName: "good_comment",
        freezeTableName: true,
        timestamps: true,
    }
);

export default GoodComment;