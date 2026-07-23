"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        // カラム追加
        // user
        await queryInterface.addColumn("user", "address_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("user", "name_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("user", "account_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        // transfer
        await queryInterface.addColumn("transfer", "account_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        // shopInfoEdit
        await queryInterface.addColumn("shop_info_edit", "address_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("shop_info_edit", "account_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        // shopInfo
        await queryInterface.addColumn("shop_info", "address_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("shop_info", "account_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        // delivery
        await queryInterface.addColumn("delivery", "address_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("delivery", "name_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        // 外部キー追加
        // user
        await queryInterface.addConstraint("user", {
            fields: ["address_id"],
            type: "foreign key",
            name: "fk_user_address_id",
            references: {
                table: "address",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
        await queryInterface.addConstraint("user", {
            fields: ["name_id"],
            type: "foreign key",
            name: "fk_user_name_id",
            references: {
                table: "name",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
        await queryInterface.addConstraint("user", {
            fields: ["account_id"],
            type: "foreign key",
            name: "fk_user_account_id",
            references: {
                table: "bank_account",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        // transfer
        await queryInterface.addConstraint("transfer", {
            fields: ["account_id"],
            type: "foreign key",
            name: "fk_transfer_account_id",
            references: {
                table: "bank_account",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        // shopInfoEdit
        await queryInterface.addConstraint("shop_info_edit", {
            fields: ["address_id"],
            type: "foreign key",
            name: "fk_shop_info_edit_address_id",
            references: {
                table: "address",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
        await queryInterface.addConstraint("shop_info_edit", {
            fields: ["account_id"],
            type: "foreign key",
            name: "fk_shop_info_edit_account_id",
            references: {
                table: "bank_account",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        // shopInfo
        await queryInterface.addConstraint("shop_info", {
            fields: ["address_id"],
            type: "foreign key",
            name: "fk_shop_info_address_id",
            references: {
                table: "address",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
        await queryInterface.addConstraint("shop_info", {
            fields: ["account_id"],
            type: "foreign key",
            name: "fk_shop_info_account_id",
            references: {
                table: "bank_account",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        // delivery
        await queryInterface.addConstraint("delivery", {
            fields: ["address_id"],
            type: "foreign key",
            name: "fk_delivery_address_id",
            references: {
                table: "address",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
        await queryInterface.addConstraint("delivery", {
            fields: ["name_id"],
            type: "foreign key",
            name: "fk_delivery_name_id",
            references: {
                table: "name",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    },

    async down(queryInterface, Sequelize) {
        // 外部キー制約
        await queryInterface.removeConstraint("user", "fk_user_address_id");
        await queryInterface.removeConstraint("user", "fk_user_name_id");
        await queryInterface.removeConstraint("user", "fk_user_account_id");
        await queryInterface.removeConstraint("transfer", "fk_transfer_account_id");
        await queryInterface.removeConstraint("shop_info_edit", "fk_shop_info_edit_address_id");
        await queryInterface.removeConstraint("shop_info_edit", "fk_shop_info_edit_account_id");
        await queryInterface.removeConstraint("shop_info", "fk_shop_info_address_id");
        await queryInterface.removeConstraint("shop_info", "fk_shop_info_account_id");
        await queryInterface.removeConstraint("delivery", "fk_delivery_address_id");
        await queryInterface.removeConstraint("delivery", "fk_delivery_name_id");

        // カラム
        await queryInterface.removeColumn("user", "address_id");
        await queryInterface.removeColumn("user", "name_id");
        await queryInterface.removeColumn("user", "account_id");
        await queryInterface.removeColumn("transfer", "account_id");
        await queryInterface.removeColumn("shop_info_edit", "address_id");
        await queryInterface.removeColumn("shop_info_edit", "account_id");
        await queryInterface.removeColumn("shop_info", "address_id");
        await queryInterface.removeColumn("shop_info", "account_id");
        await queryInterface.removeColumn("delivery", "address_id");
        await queryInterface.removeColumn("delivery", "name_id");
    },
};
