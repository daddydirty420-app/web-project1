import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import ShopInfo from "./shop_info.js";
import ShopInfoEdit from "./shop_info_edit.js";
import Delivery from "./delivery.js";
import User from "./user.js";

export class Name extends Model {
    declare id: number;
    declare sei: string | null;
    declare mei: string | null;
    declare sei_kana: string | null;
    declare mei_kana: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare shop_type: string;
    declare shop_info_edit_id: number | null;
    declare delivery_id: number | null;
    declare user_id: number | null;

    static associate() {
        Name.belongsTo(Delivery, {
            foreignKey: "delivery_id",
        });
        Name.belongsTo(User, {
            foreignKey: "user_id",
        });
        Name.hasOne(ShopInfo, {
            foreignKey: "name_representative_id",
            as: "RepresentativeName",
        });
        Name.hasOne(ShopInfo, {
            foreignKey: "name_contact_id",
            as: "ContactName",
        });
        Name.hasOne(ShopInfoEdit, {
            foreignKey: "name_representative_id",
            as: "RepresentativeNameEdit",
        });
        Name.hasOne(ShopInfoEdit, {
            foreignKey: "name_contact_id",
            as: "ContactNameEdit",
        });
    }

    static associations: {
        ShopInfo: Association<Name, ShopInfo>;
        ShopInfoEdit: Association<Name, ShopInfoEdit>;
        Delivery: Association<Name, Delivery>;
        User: Association<Name, User>;
    };
}

Name.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        sei: DataTypes.STRING(255),
        mei: DataTypes.STRING(255),
        sei_kana: DataTypes.STRING(255),
        mei_kana: DataTypes.STRING(255),
        shop_type: {
            type: DataTypes.STRING(20),
            validate: {
                isIn: [["representative", "contact"]],
            },
        },
        delivery_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "Name",
        tableName: "name",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Name;
