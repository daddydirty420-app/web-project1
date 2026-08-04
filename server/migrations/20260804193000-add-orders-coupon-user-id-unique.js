"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.addConstraint("orders", {
                fields: ["coupon_user_id"],
                type: "unique",
                name: "orders_coupon_user_id_unique",
                transaction,
            });
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.removeConstraint("orders", "orders_coupon_user_id_unique", {
                transaction,
            });
        });
    },
};
