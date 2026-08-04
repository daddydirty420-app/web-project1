import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";

export class ReferenceCode extends Model {
    declare id: number;
    declare input: string | null;
    declare output: string | null;
    declare input_user_id: number | null;
    declare output_user_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare checked: boolean;

    static associate() {
        ReferenceCode.belongsTo(User, {
            foreignKey: "input_user_id",
            as: "InputUser",
        });
        ReferenceCode.belongsTo(User, {
            foreignKey: "output_user_id",
            as: "OutputUser",
        });
    }

    static associations: {
        InputUser: Association<ReferenceCode, User>;
        OutputUser: Association<ReferenceCode, User>;
    };
}

ReferenceCode.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        input: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        output: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
        input_user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        output_user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        checked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
        modelName: "ReferenceCode",
        tableName: "reference_code",
        freezeTableName: true,
        timestamps: true,
    },
);

export default ReferenceCode;
