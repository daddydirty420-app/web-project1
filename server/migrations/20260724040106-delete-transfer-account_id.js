"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        // 制約
        await queryInterface.removeConstraint("transfer", "fk_transfer_account_id");

        // カラム
        await queryInterface.removeColumn("transfer", "account_id");
    },

    async down(queryInterface, Sequelize) {
        // カラム
        await queryInterface.addColumn("transfer", "account_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        
        // 制約
        await queryInterface.addConstraint("transfer", {
            fields: ["account_id"],
            type: "foreign key",
            name: "fk_transfer_account_id",
            references: {
                table: "bank_account",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    },
};
