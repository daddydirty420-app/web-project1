"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            for (const tableName of ["shop_info", "shop_info_edit"]) {
                await queryInterface.addColumn(
                    tableName,
                    "idcard_id",
                    {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                        unique: true,
                        references: {
                            model: "id_card",
                            key: "id",
                        },
                        onUpdate: "CASCADE",
                        onDelete: "SET NULL",
                    },
                    { transaction },
                );
            }

            for (const tableName of ["shop_info", "shop_info_edit"]) {
                await queryInterface.removeColumn(tableName, "id_card_front", { transaction });
                await queryInterface.removeColumn(tableName, "id_card_rear", { transaction });
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            for (const tableName of ["shop_info_edit", "shop_info"]) {
                await queryInterface.addColumn(
                    tableName,
                    "id_card_rear",
                    {
                        type: Sequelize.TEXT,
                        allowNull: true,
                    },
                    { transaction },
                );
                await queryInterface.addColumn(
                    tableName,
                    "id_card_front",
                    {
                        type: Sequelize.TEXT,
                        allowNull: true,
                    },
                    { transaction },
                );
            }

            for (const tableName of ["shop_info_edit", "shop_info"]) {
                await queryInterface.removeColumn(tableName, "idcard_id", { transaction });
            }
        });
    },
};
