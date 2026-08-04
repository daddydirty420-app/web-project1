import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class CommentReportOption extends Model {
    declare id: number;
    declare name: string;
    declare createdAt: Date;
    declare updatedAt: Date;

}

CommentReportOption.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
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
        modelName: "CommentReportOption",
        tableName: "comment_report_option",
        freezeTableName: true,
        timestamps: true,
    },
);

export default CommentReportOption;
