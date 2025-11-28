import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class TodouhukenOption extends Model {
    declare id: number;
    declare name: string;
};

TodouhukenOption.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "TodouhukenOption",
        tableName: "todouhuken_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default TodouhukenOption;