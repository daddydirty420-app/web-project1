"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.createTable(
                "s3_metadata",
                {
                    id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true,
                    },
                    bucket_name: {
                        type: Sequelize.STRING(255),
                        allowNull: false,
                    },
                    object_key: {
                        type: Sequelize.TEXT,
                        allowNull: false,
                    },
                    version_id: {
                        type: Sequelize.STRING(255),
                        allowNull: true,
                    },
                    original_file_name: {
                        type: Sequelize.STRING(255),
                        allowNull: true,
                    },
                    content_type: {
                        type: Sequelize.STRING(255),
                        allowNull: false,
                    },
                    file_size: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    etag: {
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
                },
                { transaction },
            );

            await queryInterface.addIndex("s3_metadata", ["bucket_name", "object_key"], {
                unique: true,
                name: "uq_s_metadata_bucket_name_object_key",
                transaction,
            });
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("s3_metadata");
    },
};
