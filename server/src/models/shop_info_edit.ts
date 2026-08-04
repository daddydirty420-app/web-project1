import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import Address from "./address.js";
import BankAccount from "./bank_account.js";
import ComOrFreeOption from "./com_or_free_option.js";
import Name from "./name.js";
import ShopInfo from "./shop_info.js";
import User from "./user.js";

export class ShopInfoEdit extends Model {
    declare id: number;
    declare company_name: string | null;
    declare company_number: string | null;
    declare id_card_front: string | null;
    declare id_card_rear: string | null;
    declare phone_number: string | null;
    declare email: string | null;
    declare founded_date: Date | null;
    declare member_count: number | null;
    declare homepage_url: string | null;
    declare capital: number | null;
    declare open_date_time: string | null;
    declare user_id: number | null;
    declare shop_info_id: number | null;
    declare com_or_free_id: number | null;
    declare permit_url: string[] | null;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare name_representative_id: number | null;
    declare name_contact_id: number | null;
    declare address_id: number | null;
    declare account_id: number | null;

    static associate() {
        ShopInfoEdit.belongsTo(User, {
            foreignKey: "user_id",
        });
        ShopInfoEdit.belongsTo(ShopInfo, {
            foreignKey: "shop_info_id",
        });
        ShopInfoEdit.belongsTo(ComOrFreeOption, {
            foreignKey: "com_or_free_id",
        });
        ShopInfoEdit.belongsTo(Name, {
            foreignKey: "name_representative_id",
            as: "RepresentativeNameEdit",
        });
        ShopInfoEdit.belongsTo(Name, {
            foreignKey: "name_contact_id",
            as: "ContactNameEdit",
        });
        ShopInfoEdit.belongsTo(Address, {
            foreignKey: "address_id",
        });
        ShopInfoEdit.belongsTo(BankAccount, {
            foreignKey: "account_id",
        });
    }

    static associations: {
        User: Association<ShopInfoEdit, User>;
        ShopInfo: Association<ShopInfoEdit, ShopInfo>;
        ComOrFreeOption: Association<ShopInfoEdit, ComOrFreeOption>;
        Address: Association<ShopInfoEdit, Address>;
        RepresentativeNameEdit: Association<ShopInfoEdit, Name>;
        ContactNameEdit: Association<ShopInfoEdit, Name>;
        BankAccount: Association<ShopInfoEdit, BankAccount>;
    };
}

ShopInfoEdit.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        company_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        company_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        id_card_front: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        id_card_rear: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        phone_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        founded_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        member_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        homepage_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        capital: {
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        open_date_time: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
        },
        shop_info_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "shop_info",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
        },
        com_or_free_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "com_or_free_option",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
        },
        permit_url: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: true,
            validate: {
                maxArrayLength(value: any[]) {
                    if (value && value.length > 10) {
                        throw new Error("画像は最大10枚までです。");
                    }
                },
            },
        },
        name_representative_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
            references: {
                model: "name",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
        },
        name_contact_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
            references: {
                model: "name",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
        },
        address_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
            references: {
                model: "address",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
            references: {
                model: "bank_account",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
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
        modelName: "ShopInfoEdit",
        tableName: "shop_info_edit",
        freezeTableName: true,
        timestamps: true,
    },
);

export default ShopInfoEdit;
