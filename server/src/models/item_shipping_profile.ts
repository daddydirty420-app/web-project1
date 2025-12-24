import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import Item from "./item.js";
import ShippingDayOption from "./shipping_day_option.js";
import ShippingServiceOption from "./shipping_service_option.js";
import TodouhukenOption from "./todouhuken_option.js";

export class ItemShippingProfile extends Model {
    declare id: number;
    declare item_id: number;
    declare shipping_day_id: number | null;
    declare shipping_service_id: number | null;
    declare shipping_place_id: number | null;
    declare shipping_service_free_text: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    
    static associate() {
        ItemShippingProfile.belongsTo(ShippingDayOption, {
            foreignKey: "shipping_day_id",
        });
        ItemShippingProfile.belongsTo(ShippingServiceOption, {
            foreignKey: "shipping_service_id",
        });
        ItemShippingProfile.belongsTo(TodouhukenOption, {
            foreignKey: "shipping_place_id",
        });
        ItemShippingProfile.belongsTo(Item, {
            foreignKey: "item_id",
        });
    };
    
    static associations: {
        ShippingDayOption: Association<ItemShippingProfile, ShippingDayOption>;
        ShippingServiceOption: Association<ItemShippingProfile, ShippingServiceOption>;
        TodouhukenOption: Association<ItemShippingProfile, TodouhukenOption>;
        Item: Association<ItemShippingProfile, Item>;
    };
};

ItemShippingProfile.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        shipping_day_id: DataTypes.INTEGER,
        shipping_service_id: DataTypes.INTEGER,
        shipping_place_id: DataTypes.INTEGER,
        shipping_service_free_text: DataTypes.STRING(255),
    },
    {
        sequelize,
        modelName: "ItemShippingProfile",
        tableName: "item_shipping_profile",
        freezeTableName: true,
        timestamps: true,
    },
);

export default ItemShippingProfile;