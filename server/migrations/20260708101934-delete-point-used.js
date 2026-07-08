"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn("points_history", "used_points");
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn("points_history", "used_points", {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
        });
    },
};
