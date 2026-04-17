import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import Comment from "./comment.js";
import User from "./user.js";
import CommentReportOption from "./comment_report_option.js";

export class CommentReport extends Model {
    declare id: number;
    declare comment_id: number;
    declare report_user_id: number;
    declare option_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        CommentReport.belongsTo(Comment, {
            foreignKey: "comment_id",
        });
        CommentReport.belongsTo(User, {
            foreignKey: "report_user_id",
        });
        CommentReport.belongsTo(CommentReportOption, {
            foreignKey: "option_id",
        });
    }

    static associations: {
        Comment: Association<CommentReport, Comment>;
        User: Association<CommentReport, User>;
        CommentReportOption: Association<CommentReport, CommentReportOption>;
    };
}

CommentReport.init(
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
        report_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        option_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "CommentReport",
        tableName: "comment_report",
        freezeTableName: true,
        timestamps: true,
    },
);

export default CommentReport;
