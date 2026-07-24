"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        // address
        await queryInterface.removeColumn("address", "user_id");
        await queryInterface.removeColumn("address", "delivery_id");
        await queryInterface.removeColumn("address", "shop_info_id");
        await queryInterface.removeColumn("address", "shop_info_edit_id");

        // bank_account
        await queryInterface.removeColumn("bank_account", "user_id");
        await queryInterface.removeColumn("bank_account", "shop_info_id");
        await queryInterface.removeColumn("bank_account", "shop_info_edit_id");
        await queryInterface.removeColumn("bank_account", "transfer_id");

        // name
        await queryInterface.removeColumn("name", "user_id");
        await queryInterface.removeColumn("name", "delivery_id");

        // id_card
        await queryInterface.removeColumn("id_card", "user_id");
        await queryInterface.removeColumn("id_card", "shop_info_id");
        await queryInterface.removeColumn("id_card", "shop_info_edit_id");
    },

    async down(queryInterface, Sequelize) {
        // address
        await queryInterface.addColumn("address", "user_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("address", "delivery_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("address", "shop_info_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("address", "shop_info_edit_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        // bank_account
        await queryInterface.addColumn("bank_account", "user_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("bank_account", "shop_info_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("bank_account", "shop_info_edit_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("bank_account", "transfer_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        // name
        await queryInterface.addColumn("name", "user_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("name", "delivery_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        // id_card
        await queryInterface.addColumn("id_card", "user_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },
};
