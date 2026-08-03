"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.addConstraint("coupon_user", {
                fields: ["coupon_id", "user_id"],
                type: "unique",
                name: "uq_coupon_user_coupon_id_user_id",
                transaction,
            });

            await queryInterface.addConstraint("coupon_item", {
                fields: ["coupon_id", "item_id"],
                type: "unique",
                name: "uq_coupon_item_coupon_id_item_id",
                transaction,
            });

            await queryInterface.addConstraint("coupon_shop", {
                fields: ["coupon_id", "shop_info_id"],
                type: "unique",
                name: "uq_coupon_shop_coupon_id_shop_info_id",
                transaction,
            });

            await queryInterface.addConstraint("coupon_category", {
                fields: ["coupon_id", "category_id"],
                type: "unique",
                name: "uq_coupon_category_coupon_id_category_id",
                transaction,
            });
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.removeConstraint("coupon_category", "uq_coupon_category_coupon_id_category_id", {
                transaction,
            });
            await queryInterface.removeConstraint("coupon_shop", "uq_coupon_shop_coupon_id_shop_info_id", {
                transaction,
            });
            await queryInterface.removeConstraint("coupon_item", "uq_coupon_item_coupon_id_item_id", {
                transaction,
            });
            await queryInterface.removeConstraint("coupon_user", "uq_coupon_user_coupon_id_user_id", {
                transaction,
            });
        });
    },
};
