"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn("uriagekin_history", "used_uriagekin");
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn("uriagekin_history", "used_uriagekin", {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
        });
    },
};
