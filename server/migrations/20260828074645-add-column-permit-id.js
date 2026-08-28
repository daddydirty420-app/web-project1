"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            for (const tableName of ["shop_info", "shop_signup", "shop_info_edit"]) {
                await queryInterface.addColumn(
                    tableName,
                    "permit_id",
                    {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                        unique: true,
                        references: {
                            model: "permit",
                            key: "id",
                        },
                        onUpdate: "CASCADE",
                        onDelete: "SET NULL",
                    },
                    { transaction },
                );
            }

            for (const tableName of ["shop_info", "shop_signup", "shop_info_edit"]) {
                await queryInterface.removeColumn(tableName, "permit_url", { transaction });
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            for (const tableName of ["shop_info_edit", "shop_signup", "shop_info"]) {
                await queryInterface.addColumn(
                    tableName,
                    "permit_url",
                    {
                        type: Sequelize.ARRAY(Sequelize.TEXT),
                        allowNull: true,
                    },
                    { transaction },
                );
            }

            for (const tableName of ["shop_info_edit", "shop_signup", "shop_info"]) {
                await queryInterface.removeColumn(tableName, "permit_id", { transaction });
            }
        });
    },
};
