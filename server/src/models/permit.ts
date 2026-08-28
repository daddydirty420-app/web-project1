import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import PermitFile from "./permit_file.js";
import ShopInfo from "./shop_info.js";
import ShopInfoEdit from "./shop_info_edit.js";
import ShopSignup from "./shop_signup.js";

export class Permit extends Model {
    declare id: number;

    declare permit_number: string | null;
    declare permit_type: string | null;
    declare issued_at: Date | null; // 登録日・許可証発行日
    declare expired_at: Date | null;

    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Permit.hasOne(ShopInfo, {
            foreignKey: "permit_id",
        });
        Permit.hasOne(ShopSignup, {
            foreignKey: "permit_id",
        });
        Permit.hasOne(ShopInfoEdit, {
            foreignKey: "permit_id",
        });
        Permit.hasMany(PermitFile, {
            foreignKey: "permit_id",
        });
    }

    static associations: {
        ShopInfo: Association<Permit, ShopInfo>;
        ShopSignup: Association<Permit, ShopSignup>;
        ShopInfoEdit: Association<Permit, ShopInfoEdit>;
        PermitFile: Association<Permit, PermitFile>;
    };
}

Permit.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        permit_number: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        permit_type: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        issued_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        expired_at: {
            type: DataTypes.DATE,
            allowNull: true,
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
        modelName: "Permit",
        tableName: "permit",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Permit;
