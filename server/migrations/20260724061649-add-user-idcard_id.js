"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        // カラム
        await queryInterface.addColumn("user", "idcard_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
            unique: true,
        });

        // 制約
        await queryInterface.addConstraint("user", {
            fields: ["idcard_id"],
            type: "foreign key",
            name: "fk_user_idcard_id",
            references: {
                table: "id_card",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    },

    async down(queryInterface, Sequelize) {
        // 制約
        await queryInterface.removeConstraint("user", "fk_user_idcard_id");

        // カラム
        await queryInterface.removeColumn("user", "idcard_id");
    },
};
