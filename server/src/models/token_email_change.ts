import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db.js';

import User from './user.js';

export class TokenEmailChange extends Model {
    declare id: number;
    declare token_hash: string;
    declare expires_at: Date;
    declare user_id: number;
    declare new_email: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        TokenEmailChange.belongsTo(User, {
            foreignKey: 'user_id',
        });
    }

    static associations: {
        User: Association<TokenEmailChange, User>;
    };
}

TokenEmailChange.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        token_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        new_email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'TokenEmailChange',
        tableName: 'token_email_change',
        freezeTableName: true,
        timestamps: true,
    },
);

export default TokenEmailChange;
