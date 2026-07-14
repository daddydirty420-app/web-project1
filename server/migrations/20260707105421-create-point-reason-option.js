"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        // point_reason_option作成
        await queryInterface.createTable("point_reason_option", {
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
        await queryInterface.addColumn("points_history", "reason_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        // 外部キー追加
        await queryInterface.addConstraint("points_history", {
            fields: ["reason_id"],
            type: "foreign key",
            name: "fk_points_history_reason_id",
            references: {
                table: "point_reason_option",
                field: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint("points_history", "fk_points_history_reason_id");

        await queryInterface.removeColumn("points_history", "reason_id");

        await queryInterface.dropTable("point_reason_option");
    },
};
