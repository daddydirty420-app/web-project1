"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addIndex("item", {
            name: "idx_item_status_seller_sort_desc",
            fields: [
                "status",
                "seller_id",
                {
                    name: "sort_number",
                    order: "DESC",
                },
            ],
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex("item", "idx_item_status_sort_uploaded_desc");
    },
};
