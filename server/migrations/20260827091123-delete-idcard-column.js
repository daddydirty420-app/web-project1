"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.removeColumn("id_card", "id_card_front", { transaction });
            await queryInterface.removeColumn("id_card", "id_card_rear", { transaction });

            await queryInterface.addColumn(
                "id_card",
                "front_s3_metadata_id",
                {
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
                { transaction },
            );
            await queryInterface.addColumn(
                "id_card",
                "rear_s3_metadata_id",
                {
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
                { transaction },
            );

            await queryInterface.sequelize.query(
                `ALTER TABLE id_card
                 ADD CONSTRAINT chk_id_card_front_rear_different
                 CHECK (
                     front_s3_metadata_id IS NULL
                     OR rear_s3_metadata_id IS NULL
                     OR front_s3_metadata_id <> rear_s3_metadata_id
                 );`,
                { transaction },
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.removeConstraint("id_card", "chk_id_card_front_rear_different", {
                transaction,
            });

            await queryInterface.removeColumn("id_card", "rear_s3_metadata_id", { transaction });
            await queryInterface.removeColumn("id_card", "front_s3_metadata_id", { transaction });

            await queryInterface.addColumn(
                "id_card",
                "id_card_rear",
                {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                { transaction },
            );
            await queryInterface.addColumn(
                "id_card",
                "id_card_front",
                {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                { transaction },
            );
        });
    },
};
