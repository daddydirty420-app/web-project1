"use strict";

/** @type {import("sequelize-cli").Migration} */
export default {
    async up(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.removeConstraint("item", "item_brand_id_fkey", {
                transaction,
            });

            await queryInterface.addConstraint("item", {
                fields: ["brand_id"],
                type: "foreign key",
                name: "item_brand_id_fkey",
                references: {
                    table: "brands",
                    field: "id",
                },
                onUpdate: "NO ACTION",
                onDelete: "SET NULL",
                transaction,
            });

            await queryInterface.removeConstraint("item", "item_brand_aliases_id_fkey", {
                transaction,
            });

            await queryInterface.addConstraint("item", {
                fields: ["brand_aliases_id"],
                type: "foreign key",
                name: "item_brand_aliases_id_fkey",
                references: {
                    table: "brand_aliases",
                    field: "id",
                },
                onUpdate: "NO ACTION",
                onDelete: "SET NULL",
                transaction,
            });
        });
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.removeConstraint("item", "item_brand_id_fkey", {
                transaction,
            });

            await queryInterface.addConstraint("item", {
                fields: ["brand_id"],
                type: "foreign key",
                name: "item_brand_id_fkey",
                references: {
                    table: "brands",
                    field: "id",
                },
                onUpdate: "NO ACTION",
                onDelete: "CASCADE",
                transaction,
            });

            await queryInterface.removeConstraint("item", "item_brand_aliases_id_fkey", {
                transaction,
            });

            await queryInterface.addConstraint("item", {
                fields: ["brand_aliases_id"],
                type: "foreign key",
                name: "item_brand_aliases_id_fkey",
                references: {
                    table: "brand_aliases",
                    field: "id",
                },
                onUpdate: "NO ACTION",
                onDelete: "CASCADE",
                transaction,
            });
        });
    },
};
