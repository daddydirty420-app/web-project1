"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("shop_signup", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            company_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            shop_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            phone_number: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            homepage_url: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            open_date_time: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            company_number: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            capital: {
                type: Sequelize.DECIMAL,
                allowNull: true,
            },
            member_count: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            founded_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            request_expired_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            request_all: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            auto_trans: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            open_info: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            permit_url: {
                type: Sequelize.ARRAY(Sequelize.TEXT),
                allowNull: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "user",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "NO ACTION",
            },
            com_or_free_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "com_or_free_option",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "NO ACTION",
            },
            name_representative_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                unique: true,
                references: {
                    model: "name",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            name_contact_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                unique: true,
                references: {
                    model: "name",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            address_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                unique: true,
                references: {
                    model: "address",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            account_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                unique: true,
                references: {
                    model: "bank_account",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            idcard_id: {
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

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("shop_signup");
    },
};
