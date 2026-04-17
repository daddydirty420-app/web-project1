import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db.js';

import BlogCategoryOption from './blog_category_option.js';

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
            foreignKey: 'blog_category_id',
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
        title: DataTypes.STRING(255),
        content: DataTypes.TEXT,
        summary: DataTypes.TEXT,
        mokuji: DataTypes.TEXT,
        image_url: DataTypes.TEXT,
        views_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        views_24h: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        public: DataTypes.BOOLEAN,
        uploaded_at: DataTypes.DATE,
        blog_category_id: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: 'Blog',
        tableName: 'blog',
        freezeTableName: true,
        timestamps: true,
    },
);

export default Blog;
