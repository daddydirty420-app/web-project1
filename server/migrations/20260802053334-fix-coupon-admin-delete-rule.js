"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.removeConstraint("coupon", "coupon_created_admin_id_fkey", { transaction });
            await queryInterface.removeConstraint("coupon", "coupon_updated_admin_id_fkey", { transaction });

            await queryInterface.addConstraint("coupon", {
                fields: ["created_admin_id"],
                type: "foreign key",
                name: "coupon_created_admin_id_fkey",
                references: {
                    table: "user",
                    field: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
                transaction,
            });

            await queryInterface.addConstraint("coupon", {
                fields: ["updated_admin_id"],
                type: "foreign key",
                name: "coupon_updated_admin_id_fkey",
                references: {
                    table: "user",
                    field: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
                transaction,
            });
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.removeConstraint("coupon", "coupon_created_admin_id_fkey", { transaction });
            await queryInterface.removeConstraint("coupon", "coupon_updated_admin_id_fkey", { transaction });

            await queryInterface.addConstraint("coupon", {
                fields: ["created_admin_id"],
                type: "foreign key",
                name: "coupon_created_admin_id_fkey",
                references: {
                    table: "user",
                    field: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
                transaction,
            });

            await queryInterface.addConstraint("coupon", {
                fields: ["updated_admin_id"],
                type: "foreign key",
                name: "coupon_updated_admin_id_fkey",
                references: {
                    table: "user",
                    field: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
                transaction,
            });
        });
    },
};
