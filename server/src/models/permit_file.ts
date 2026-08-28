import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import Permit from "./permit.js";
import S3Metadata from "./s3_metadata.js";

export class PermitFile extends Model {
    declare id: number;

    declare permit_id: number;
    declare s3_metadata_id: number | null;
    declare sort_order: number | null;
    declare document_name: string | null;
    declare memo: string | null;

    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        PermitFile.belongsTo(Permit, {
            foreignKey: "permit_id",
        });
        PermitFile.belongsTo(S3Metadata, {
            foreignKey: "s3_metadata_id",
        });
    }

    static associations: {
        Permit: Association<PermitFile, Permit>;
        S3Metadata: Association<PermitFile, S3Metadata>;
    };
}

PermitFile.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        permit_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "permit",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        s3_metadata_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
            references: {
                model: "s3_metadata",
                key: "id",
            },
            onUpdate: "NO ACTION",
            onDelete: "NO ACTION",
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        document_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        memo: {
            type: DataTypes.STRING,
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
        modelName: "PermitFile",
        tableName: "permit_file",
        freezeTableName: true,
        timestamps: true,
    }
)

export default PermitFile;