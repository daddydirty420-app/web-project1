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
        });
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            for (const tableName of ["shop_info_edit", "shop_info"]) {
                await queryInterface.removeColumn(tableName, "idcard_id", { transaction });
            }
        });
    },
};
