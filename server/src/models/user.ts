import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import Follow from "./follow.js";
import Cart from "./cart.js";
import GoodComment from "./good_comment.js";
import GoodItem from "./good_item.js";
import Item from "./item.js";
import ReferenceCode from "./reference_code.js";
import Notification from "./notification.js";
import ReccomendPaidInfo from "./reccomend_paid_info.js";
import IdCard from "./id_card.js";
import ShopInfo from "./shop_info.js";
import Address from "./address.js";
import BankAccount from "./bank_account.js";
import WatchHistory from "./watch_history.js";
import Name from "./name.js";
import ReccomendMonth from "./reccomend_month.js";
import GenderOption from "./gender_option.js";
import PointsHistory from "./points_history.js";
import UriagekinHistory from "./uriagekin_history.js";

export class User extends Model {
    declare id: number;
    declare user_name: string | null;
    declare user_introduction: string | null;
    declare profile_image: string | null;
    declare penalty_points: number | null;
    declare early_seller: boolean | null;
    declare honnin_verified: boolean | null;
    declare admin: boolean | null;
    declare createdAt: Date;
    declare email: string;
    declare updatedAt: Date;
    declare campaign_points: number | null;
    declare campaign_points_sum: number | null;
    declare password: string;
    declare points: number | null;
    declare uriagekin: number | null;
    declare star_amount: number | null;
    declare star_average: number | null;
    declare gender_id: number | null;
    declare birthday: Date | null;
    declare phone_number: string | null;
    declare honnin_verify_request: boolean | null;
    declare email_verified: boolean | null;

    static associate() {
        User.hasMany(Cart, {
            foreignKey: 'addtocart_user_id'
        });
        User.hasMany(Follow, {
            foreignKey: 'follow_user_id',
            as: 'FollowUser'
        });
        User.hasMany(Follow, {
            foreignKey: 'follower_user_id',
            as: 'FollowerUser'
        });
        User.hasMany(GoodComment, {
            foreignKey: 'good_user_id'
        });
        User.hasMany(GoodItem, {
            foreignKey: 'good_user_id'
        });
        User.hasMany(Item, {
            foreignKey: 'seller_id'
        });
        User.hasMany(ReferenceCode, {
            foreignKey: 'output_user_id',
            as: 'Output'
        });
        User.hasMany(Notification, {
            foreignKey: 'read_user_id'
        });
        User.hasMany(ReccomendPaidInfo, {
            foreignKey: 'user_id'
        });
        User.hasOne(IdCard, {
            foreignKey: 'user_id'
        });
        User.hasOne(ShopInfo, {
            foreignKey: 'user_id'
        });
        User.hasOne(Address, {
            foreignKey: 'user_id'
        });
        User.hasOne(BankAccount, {
            foreignKey: 'user_id'
        });
        User.hasMany(WatchHistory, {
            foreignKey: 'user_id'
        });
        User.hasOne(Name, {
            foreignKey: 'user_id'
        });
        User.hasOne(ReferenceCode, {
            foreignKey: 'input_user_id',
            as: 'Input'
        });
        User.hasOne(ReccomendMonth, {
            foreignKey: 'user_id'
        });
        User.belongsTo(GenderOption, {
            foreignKey: 'gender_id'
        });
        User.hasMany(PointsHistory, {
            foreignKey: 'user_id'
        });
        User.hasMany(UriagekinHistory, {
            foreignKey: 'user_id'
        });
    }

    static associations: {
        Cart: Association<User, Cart>;
        Follow: Association<User, Follow>;
        GoodComment: Association<User, GoodComment>;
        GoodItem: Association<User, GoodItem>;
        Item: Association<User, Item>;
        ReferenceCode: Association<User, ReferenceCode>;
        Notification: Association<User, Notification>;
        ReccomendPaidInfo: Association<User, ReccomendPaidInfo>;
        IdCard: Association<User, IdCard>;
        ShopInfo: Association<User, ShopInfo>;
        Address: Association<User, Address>;
        BankAccount: Association<User, BankAccount>;
        WatchHistory: Association<User, WatchHistory>;
        Name: Association<User, Name>;
        ReccomendMonth: Association<User, ReccomendMonth>;
        GenderOption: Association<User, GenderOption>;
        PointsHistory: Association<User, PointsHistory>;
        UriagekinHistory: Association<User, UriagekinHistory>;
    };
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_name: DataTypes.TEXT,
        user_introduction: DataTypes.TEXT,
        profile_image: DataTypes.TEXT,
        penalty_points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        early_seller: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        honnin_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        campaign_points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        campaign_points_sum: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        uriagekin: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        star_amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        star_average: {
            type: DataTypes.DECIMAL,
            defaultValue: 0,
        },
        gender_id: DataTypes.INTEGER,
        birthday: DataTypes.DATE,
        phone_number: DataTypes.TEXT,
        honnin_verify_request: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "user",
        freezeTableName: true,
        timestamps: true,
    }
);

export default User;