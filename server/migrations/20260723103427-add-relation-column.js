"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // カラム追加
        // user
        await queryInterface.addColumn("user", "address_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("user", "address_id", {
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
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    },
};
