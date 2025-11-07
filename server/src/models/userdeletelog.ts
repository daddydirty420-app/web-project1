import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class UserDeleteLogs extends Model {
    declare id: number;
    declare user_id: number;
    declare delete_reason: string | null;
    declare delete_by_admin: boolean;
    declare admin_id: number | null;
    declare ip_address: string | null;
    declare user_agent: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        UserDeleteLogs.belongsTo(User, {
            foreignKey: 'user_id'
        });
        UserDeleteLogs.belongsTo(User, {
            foreignKey: 'admin_id'
        });
    }

    static associations: {
        User: Association<UserDeleteLogs, User>;
    };
}

UserDeleteLogs.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        delete_reason: DataTypes.TEXT,
        deleted_by_admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        admin_id: DataTypes.INTEGER,
        ip_address: DataTypes.TEXT,
        user_agent: DataTypes.TEXT,
    },
    {
        sequelize,
        timestamps: true,
    }
);

export default UserDeleteLogs;