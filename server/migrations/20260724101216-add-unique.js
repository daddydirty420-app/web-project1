"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        // user
        await queryInterface.addConstraint("user", {
            fields: ["address_id"],
            type: "unique",
            name: "user_address_id_unique",
        });
        await queryInterface.addConstraint("user", {
            fields: ["name_id"],
            type: "unique",
            name: "user_name_id_unique",
        });
        await queryInterface.addConstraint("user", {
            fields: ["account_id"],
            type: "unique",
            name: "user_account_id_unique",
        });

        // delivery
        await queryInterface.addConstraint("delivery", {
            fields: ["address_id"],
            type: "unique",
            name: "delivery_address_id_unique",
        });
        await queryInterface.addConstraint("delivery", {
            fields: ["name_id"],
            type: "unique",
            name: "delivery_name_id_unique",
        });

        // shop_info
        await queryInterface.addConstraint("shop_info", {
            fields: ["name_representative_id"],
            type: "unique",
            name: "shop_info_name_representative_id_unique",
        });
        await queryInterface.addConstraint("shop_info", {
            fields: ["name_contact_id"],
            type: "unique",
            name: "shop_info_name_contact_id_unique",
        });
        await queryInterface.addConstraint("shop_info", {
            fields: ["address_id"],
            type: "unique",
            name: "shop_info_address_id_unique",
        });
        await queryInterface.addConstraint("shop_info", {
            fields: ["account_id"],
            type: "unique",
            name: "shop_info_account_id_unique",
        });

        // shop_info_edit
        await queryInterface.addConstraint("shop_info_edit", {
            fields: ["name_representative_id"],
            type: "unique",
            name: "shop_info_edit_name_representative_id_unique",
        });
        await queryInterface.addConstraint("shop_info_edit", {
            fields: ["name_contact_id"],
            type: "unique",
            name: "shop_info_edit_name_contact_id_unique",
        });
        await queryInterface.addConstraint("shop_info_edit", {
            fields: ["address_id"],
            type: "unique",
            name: "shop_info_edit_address_id_unique",
        });
        await queryInterface.addConstraint("shop_info_edit", {
            fields: ["account_id"],
            type: "unique",
            name: "shop_info_edit_account_id_unique",
        });
    },

    async down(queryInterface, Sequelize) {
        // user
        await queryInterface.removeConstraint("user", "user_address_id_unique");
        await queryInterface.removeConstraint("user", "user_name_id_unique");
        await queryInterface.removeConstraint("user", "user_account_id_unique");

        // delivery
        await queryInterface.removeConstraint("delivery", "delivery_address_id_unique");
        await queryInterface.removeConstraint("delivery", "delivery_account_id_unique");

        // shop_info
        await queryInterface.removeConstraint("shop_info", "shop_info_name_representative_id_unique");
        await queryInterface.removeConstraint("shop_info", "shop_info_name_contact_id_unique");
        await queryInterface.removeConstraint("shop_info", "shop_info_address_id_unique");
        await queryInterface.removeConstraint("shop_info", "shop_info_account_id_unique");

        // shop_info_edit
        await queryInterface.removeConstraint("shop_info_edit", "shop_info_edit_name_representative_id_unique");
        await queryInterface.removeConstraint("shop_info_edit", "shop_info_edit_name_contact_id_unique");
        await queryInterface.removeConstraint("shop_info_edit", "shop_info_edit_address_id_unique");
        await queryInterface.removeConstraint("shop_info_edit", "shop_info_edit_account_id_unique");
    },
};
