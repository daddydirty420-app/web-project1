import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class CategoryCampOption extends Model {
    declare id: number;
    declare name: string;
};

CategoryCampOption.init(
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
        modelName: "CategoryCampOption",
        tableName: "category_camp_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default CategoryCampOption;