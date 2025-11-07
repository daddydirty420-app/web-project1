import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class CategoryOtherOption extends Model {
    declare id: number;
    declare name: string;
};

CategoryOtherOption.init(
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
        modelName: "CategoryOtherOption",
        tableName: "category_other_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default CategoryOtherOption;