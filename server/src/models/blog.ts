import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import BlogCategoryOption from "./blog_category_option.js";

export class Blog extends Model {
    declare id: number;
    declare title: string | null;
    declare content: string | null;
    declare summary: string | null;
    declare mokuji: string | null;
    declare image_url: string | null;
    declare views_count: number | null;
    declare views_24h: number | null;
    declare public: boolean | null;
    declare uploaded_at: Date | null;
    declare blog_category_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Blog.belongsTo(BlogCategoryOption, {
            foreignKey: "blog_category_id",
        });
    }

    static associations: {
        BlogCategoryOption: Association<Blog, BlogCategoryOption>;
    };
}

Blog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        summary: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        mokuji: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        image_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        views_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        views_24h: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        public: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        uploaded_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        blog_category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "blog_category_option",
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
        modelName: "Blog",
        tableName: "blog",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Blog;
