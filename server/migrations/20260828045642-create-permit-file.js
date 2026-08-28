"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("permit_file", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            permit_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "permit",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            s3_metadata_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                unique: true,
                references: {
                    model: "s3_metadata",
                    key: "id",
                },
                onUpdate: "NO ACTION",
                onDelete: "NO ACTION",
            },
            sort_order: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            document_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            memo: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("permit_file");
    },
};
