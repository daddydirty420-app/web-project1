"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.dropTable("point_conversion_logs");
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.createTable("point_conversion_logs", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            converted_points: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            before_points: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            after_points: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            reason: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            plus: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },
};
