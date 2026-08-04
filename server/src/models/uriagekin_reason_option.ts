import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

export class UriagekinReasonOption extends Model {
    declare id: number;
    declare name: string;
}

UriagekinReasonOption.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "UriagekinReasonOption",
        tableName: "uriagekin_reason_option",
        freezeTableName: true,
        timestamps: false,
    },
);

export default UriagekinReasonOption;
