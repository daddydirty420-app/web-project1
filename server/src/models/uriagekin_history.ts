import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import UriagekinReasonOption from "./uriagekin_reason_option.js";
import User from "./user.js";

export class UriagekinHistory extends Model {
    declare id: number;
    declare uriagekin: number | null;
    declare user_id: number;
    declare reason_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        UriagekinHistory.belongsTo(User, {
            foreignKey: "user_id",
        });
        UriagekinHistory.belongsTo(UriagekinReasonOption, {
            foreignKey: "reason_id",
        });
    }

    static associations: {
        User: Association<UriagekinHistory, User>;
    };
}

UriagekinHistory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        uriagekin: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        reason_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "uriagekin_reason_option",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
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
        modelName: "UriagekinHistory",
        tableName: "uriagekin_history",
        freezeTableName: true,
        timestamps: true,
    },
);

export default UriagekinHistory;
