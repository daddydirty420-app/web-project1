import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import ShopSignup from "./shop_signup.js";
import User from "./user.js";

export class IdCard extends Model {
    declare id: number;
    declare id_card_front: string | null;
    declare id_card_rear: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate () {
        IdCard.hasOne(User, {
            foreignKey: "idcard_id",
        });
        IdCard.hasOne(ShopSignup, {
            foreignKey: "idcard_id",
        });
    }

    static associations: {
        User: Association<IdCard, User>;
        ShopSignup: Association<IdCard, ShopSignup>;
    };
}

IdCard.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        id_card_front: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        id_card_rear: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        modelName: "IdCard",
        tableName: "id_card",
        freezeTableName: true,
        timestamps: true,
    },
);

export default IdCard;
