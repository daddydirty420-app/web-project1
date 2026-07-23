import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import Address from "./address.js";
import BankAccount from "./bank_account.js";
import Cart from "./cart.js";
import CommentLike from "./comment_like.js";
import Follow from "./follow.js";
import GenderOption from "./gender_option.js";
import IdCard from "./id_card.js";
import Item from "./item.js";
import ItemLike from "./item_like.js";
import Name from "./name.js";
import Notification from "./notification.js";
import PointLots from "./point_lots.js";
import PointsHistory from "./points_history.js";
import ReferenceCode from "./reference_code.js";
import ShopInfo from "./shop_info.js";
import UriagekinHistory from "./uriagekin_history.js";
import UriagekinLots from "./uriagekin_lots.js";
import WatchHistory from "./watch_history.js";

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
    declare report_trust_score: number;
    declare address_id: number | null;
    declare name_id: number | null;
    declare account_id: number | null;

    static associate() {
        User.belongsTo(Address, {
            foreignKey: "address_id",
        });
        User.belongsTo(Name, {
            foreignKey: "name_id",
        });
        User.belongsTo(BankAccount, {
            foreignKey: "account_id",
        });
        User.belongsTo(GenderOption, {
            foreignKey: "gender_id",
        });
        User.hasOne(IdCard, {
            foreignKey: "user_id",
        });
        User.hasOne(ShopInfo, {
            foreignKey: "user_id",
        });
        User.hasOne(ReferenceCode, {
            foreignKey: "input_user_id",
            as: "Input",
        });
        User.hasMany(Cart, {
            foreignKey: "user_id",
        });
        User.hasMany(Follow, {
            foreignKey: "follow_user_id",
            as: "FollowUser",
        });
        User.hasMany(Follow, {
            foreignKey: "follower_user_id",
            as: "FollowerUser",
        });
        User.hasMany(CommentLike, {
            foreignKey: "user_id",
        });
        User.hasMany(ItemLike, {
            foreignKey: "user_id",
        });
        User.hasMany(Item, {
            foreignKey: "seller_id",
        });
        User.hasMany(ReferenceCode, {
            foreignKey: "output_user_id",
            as: "Output",
        });
        User.hasMany(Notification, {
            foreignKey: "read_user_id",
        });
        User.hasMany(WatchHistory, {
            foreignKey: "user_id",
        });
        User.hasMany(PointsHistory, {
            foreignKey: "user_id",
        });
        User.hasMany(PointLots, {
            foreignKey: "user_id",
        });
        User.hasMany(UriagekinHistory, {
            foreignKey: "user_id",
        });
        User.hasMany(UriagekinLots, {
            foreignKey: "user_id",
        });
    }

    static associations: {
        Cart: Association<User, Cart>;
        Follow: Association<User, Follow>;
        CommentLike: Association<User, CommentLike>;
        ItemLike: Association<User, ItemLike>;
        Item: Association<User, Item>;
        ReferenceCode: Association<User, ReferenceCode>;
        Notification: Association<User, Notification>;
        IdCard: Association<User, IdCard>;
        ShopInfo: Association<User, ShopInfo>;
        Address: Association<User, Address>;
        BankAccount: Association<User, BankAccount>;
        WatchHistory: Association<User, WatchHistory>;
        Name: Association<User, Name>;
        GenderOption: Association<User, GenderOption>;
        PointsHistory: Association<User, PointsHistory>;
        PointLots: Association<User, PointLots>;
        UriagekinHistory: Association<User, UriagekinHistory>;
        UriagekinLots: Association<User, UriagekinLots>;
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
        user_name: DataTypes.STRING(255),
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
            type: DataTypes.STRING(255),
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
            type: DataTypes.STRING(255),
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
        phone_number: DataTypes.STRING(255),
        honnin_verify_request: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        report_trust_score: {
            type: DataTypes.DECIMAL,
            defaultValue: 0.3,
            allowNull: false,
        },
        address_id: DataTypes.INTEGER,
        name_id: DataTypes.INTEGER,
        account_id: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: "User",
        tableName: "user",
        freezeTableName: true,
        timestamps: true,
    },
);

export default User;
