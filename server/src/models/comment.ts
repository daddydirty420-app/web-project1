import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db.js';

import Item from './item.js';
import User from './user.js';
import CommentLike from './comment_like.js';
import CommentReport from './comment_report.js';

export class Comment extends Model {
    declare id: number;
    declare text: string;
    declare sort_number: number;
    declare item_id: number;
    declare parent_comment_id: number | null;
    declare user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare pin: boolean;
    declare report_score: number;

    static associate() {
        Comment.belongsTo(Item, {
            foreignKey: 'item_id',
        });
        Comment.belongsTo(Comment, {
            foreignKey: 'parent_comment_id',
        });
        Comment.belongsTo(User, {
            foreignKey: 'user_id',
        });
        Comment.hasMany(CommentLike, {
            foreignKey: 'comment_id',
        });
        Comment.hasMany(CommentReport, {
            foreignKey: 'comment_id',
        });
    }

    static associations: {
        Item: Association<Comment, Item>;
        Comment: Association<Comment, Comment>;
        User: Association<Comment, User>;
        CommentLike: Association<Comment, CommentLike>;
        CommentReport: Association<Comment, CommentReport>;
    };
}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        sort_number: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            get() {
                // getterで明示的にNumberに変換
                return Number(this.getDataValue('sort_number'));
            },
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        parent_comment_id: DataTypes.INTEGER,
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        pin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        report_score: {
            type: DataTypes.DECIMAL,
            defaultValue: 0,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Comment',
        tableName: 'comment',
        freezeTableName: true,
        timestamps: true,
    },
);

export default Comment;
