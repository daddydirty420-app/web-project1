import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class IdCard extends Model {
    declare id: number;
    declare id_card_front: string | null;
    declare id_card_rear: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        IdCard.hasOne(User, {
            foreignKey: "idcard_id",
        });
    }

    static associations: {
        User: Association<IdCard, User>;
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
        id_card_front: DataTypes.TEXT,
        id_card_rear: DataTypes.TEXT,
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
