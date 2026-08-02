"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("coupon", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            discount_type: {
                type: Sequelize.ENUM("fixed", "percent", "free_shipping"),
                allowNull: false,
            },
            discount_value: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            minimum_amount: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            maximum_discount: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            user_limit: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            issue_limit: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            distribution_type: {
                type: Sequelize.ENUM("public", "manual", "campaign"),
                allowNull: false,
                defaultValue: "public",
            },
            started_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            expires_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM("active", "stopped"),
                allowNull: false,
                defaultValue: "active",
            },
            created_admin_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "user",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            updated_admin_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "user",
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

        await queryInterface.createTable("coupon_user", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "user",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            coupon_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "coupon",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            received_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            expires_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            used_at: {
                type: Sequelize.DATE,
                allowNull: true,
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

        await queryInterface.createTable("coupon_item", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            coupon_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "coupon",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            item_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "item",
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

        await queryInterface.createTable("coupon_shop", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            coupon_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "coupon",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            shop_info_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "shop_info",
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

        await queryInterface.createTable("coupon_category", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            coupon_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "coupon",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "categories",
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

        await queryInterface.createTable("purchase_session", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            buyer_user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "user",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            item_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "item",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            address_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "address",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            name_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "name",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            coupon_user_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "coupon_user",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            buyer_phone_number: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            item_count: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            points_used: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            payment_method_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "payment_method_option",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            selected_variant: {
                type: Sequelize.JSONB,
                allowNull: false,
                defaultValue: {},
            },
            arrive_specified_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            expires_at: {
                type: Sequelize.DATE,
                allowNull: false,
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

        await queryInterface.addColumn("orders", "coupon_user_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "coupon_user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("orders", "coupon_user_id");
        await queryInterface.dropTable("purchase_session");
        await queryInterface.dropTable("coupon_category");
        await queryInterface.dropTable("coupon_shop");
        await queryInterface.dropTable("coupon_item");
        await queryInterface.dropTable("coupon_user");
        await queryInterface.dropTable("coupon");

        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_coupon_discount_type";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_coupon_distribution_type";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_coupon_status";');
    },
};
