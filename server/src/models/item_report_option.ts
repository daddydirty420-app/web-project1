import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class ItemReportOption extends Model {
    declare id: number;
    declare name: string;
}

ItemReportOption.init(
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
        modelName: "ItemReportOption",
        tableName: "item_report_option",
        freezeTableName: true,
        timestamps: false,
    },
);

export default ItemReportOption;
