import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db.js';

import User from './user.js';
import ShopInfo from './shop_info.js';
import ShopInfoEdit from './shop_info_edit.js';

export class IdCard extends Model {
    declare id: number;
    declare id_card_front: string | null;
    declare id_card_rear: string | null;
    declare user_id: number | null;
    declare shop_info_id: number | null;
    declare shop_info_edit_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        IdCard.belongsTo(User, {
            foreignKey: 'user_id',
        });
        IdCard.belongsTo(ShopInfo, {
            foreignKey: 'shop_info_id',
        });
        IdCard.belongsTo(ShopInfoEdit, {
            foreignKey: 'shop_info_edit_id',
        });
    }

    static associations: {
        User: Association<IdCard, User>;
        ShopInfo: Association<ShopInfo, User>;
        ShopInfoEdit: Association<ShopInfoEdit, User>;
    };
}

IdCard.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        id_card_front: DataTypes.TEXT,
        id_card_rear: DataTypes.TEXT,
        user_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
        shop_info_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
        shop_info_edit_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: 'IdCard',
        tableName: 'id_card',
        freezeTableName: true,
        timestamps: true,
    },
);

export default IdCard;
