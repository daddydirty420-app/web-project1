import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class BlogCategoryOption extends Model {
    declare id: number;
    declare name: string;
};

BlogCategoryOption.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "BlogCategoryOption",
        tableName: "blog_category_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default BlogCategoryOption;