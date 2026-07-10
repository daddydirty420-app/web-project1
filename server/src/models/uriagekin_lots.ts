import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class UriagekinLots extends Model {
    declare id: number;
    declare uriagekin: number;
    declare user_id: number;
    declare used_Uriagekin: number;
    declare expires_at: Date;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        UriagekinLots.belongsTo(User, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        User: Association<UriagekinLots, User>;
    };
}

UriagekinLots.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        uriagekin: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        used_uriagekin: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "UriagekinLots",
        tableName: "uriagekin_lots",
        freezeTableName: true,
        timestamps: true,
    },
);

export default UriagekinLots;
