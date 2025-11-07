import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class KanjyoOption extends Model {
    declare id: number;
    declare name: string;
};

KanjyoOption.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "KanjyoOption",
        tableName: "kanjyo_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default KanjyoOption;