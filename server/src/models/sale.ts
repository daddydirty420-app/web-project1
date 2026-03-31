import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import Item from "./item.js";

export class Sale extends Model {
    declare id: number;
    declare before_price: number | null;
    declare discount_rate: number | null;
    declare discount_amount: number | null;
    declare sale_flag: boolean;
    declare item_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Sale.belongsTo(Item, {
            foreignKey: 'item_id'
        });
    }

    static associations: {
        Item: Association<Sale, Item>;
    };
}

Sale.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        before_price: DataTypes.INTEGER,
        discount_rate: DataTypes.INTEGER,
        discount_amount: DataTypes.INTEGER,
        sale_flag: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        item_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "Sale",
        tableName: "sale",
        freezeTableName: true,
        timestamps: true,
    }
);

export default Sale;