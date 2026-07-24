"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        // カラム
        await queryInterface.removeColumn("transfer", "account_id");
    },

    async down(queryInterface, Sequelize) {
        // カラム
        await queryInterface.addColumn("transfer", "account_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },
};
