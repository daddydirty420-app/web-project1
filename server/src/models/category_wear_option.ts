import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class CategoryWearOption extends Model {
    declare id: number;
    declare name: string;
};

CategoryWearOption.init(
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
        modelName: "CategoryWearOption",
        tableName: "category_wear_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default CategoryWearOption;