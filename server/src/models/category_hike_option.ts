import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class CategoryHikeOption extends Model {
    declare id: number;
    declare name: string;
};

CategoryHikeOption.init(
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
        modelName: "CategoryHikeOption",
        tableName: "category_hike_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default CategoryHikeOption;