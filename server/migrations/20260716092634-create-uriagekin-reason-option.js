"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        // uriagekin_reason_option作成
        await queryInterface.createTable("uriagekin_reason_option", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
        });

        // reason_id追加
        await queryInterface.addColumn("uriagekin_history", "reason_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        // 外部キー追加
        await queryInterface.addConstraint("uriagekin_history", {
            fields: ["reason_id"],
            type: "foreign key",
            name: "fk_uriagekin_history_reason_id",
            references: {
                table: "uriagekin_reason_option",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint("uriagekin_history", "fk_uriagekin_history_reason_id");

        await queryInterface.removeColumn("uriagekin_history", "reason_id");

        await queryInterface.dropTable("uriagekin_reason_option");
    },
};
