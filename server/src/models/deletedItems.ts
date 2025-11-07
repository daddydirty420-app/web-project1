import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";
import Delivery from "./delivery.js";

export class DeletedItems extends Model {
    declare id: number;
    declare item_id: number;
    declare seller_id: number;
    declare item_name: string;
    declare explain: string | null;
    declare price: number;
    declare image_url: string[] | null;
    declare video_url: string | null;
    declare thumbnail_url: string | null;
    declare video_title: string | null;
    declare video_summary: string | null;
    declare parent_delevery_id: number | null;
    declare deleted_reason: string;
    declare deleted_by: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        DeletedItems.belongsTo(User, {
            foreignKey: "seller_id",
            as: "Seller",
        });
        DeletedItems.belongsTo(User, {
            foreignKey: "deleted_by",
            as: "DeletedBy",
        });
        DeletedItems.belongsTo(Delivery, {
            foreignKey: "parent_delevery_id",
        });
    }

    static associations: {
        User: Association<DeletedItems, User>;
        Delivery: Association<DeletedItems, Delivery>;
    };
}

DeletedItems.init(
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
        },
        seller_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        item_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        explain: DataTypes.TEXT,
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        image_url: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            validate: {
                maxArrayLength(value: string[]) {
                    if (value && value.length > 10) {
                        throw new Error('画像は最大10枚までです。');
                    }
                }
            }
        },
        video_url: DataTypes.TEXT,
        thumbnail_url: DataTypes.TEXT,
        video_title: DataTypes.TEXT,
        video_summary: DataTypes.TEXT,
        parent_delivery_id: DataTypes.INTEGER,
        deleted_reason: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
    }
);

export default DeletedItems;