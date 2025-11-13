"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // account_type_option
    await queryInterface.createTable("account_type_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // blog_category_option
    await queryInterface.createTable("blog_category_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // cancel_fee_return_option
    await queryInterface.createTable("cancel_fee_return_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // category_camp_option
    await queryInterface.createTable("category_camp_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // category_hike_option
    await queryInterface.createTable("category_hike_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // category_other_option
    await queryInterface.createTable("category_other_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // category_wear_option
    await queryInterface.createTable("category_wear_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // com_or_free_option
    await queryInterface.createTable("com_or_free_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // comment_report_option
    await queryInterface.createTable("comment_report_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // delivery_stauts_option
    await queryInterface.createTable("delivery_status_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // gender_option
    await queryInterface.createTable("gender_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // item_buyer_report_option
    await queryInterface.createTable("item_buyer_report_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // item_category1_option
    await queryInterface.createTable("item_category1_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // item_condition_option
    await queryInterface.createTable("item_condition_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // item_report_option
    await queryInterface.createTable("item_report_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // journal_reason_option
    await queryInterface.createTable("journal_reason_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // kanjyo_option
    await queryInterface.createTable("kanjyo_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // payment_method_option
    await queryInterface.createTable("payment_method_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // shipping_day_option
    await queryInterface.createTable("shipping_day_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // shipping_service_option
    await queryInterface.createTable("shipping_service_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // shipping_place_option
    await queryInterface.createTable("shipping_place_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // size_option
    await queryInterface.createTable("size_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // size_shoes_option
    await queryInterface.createTable("size_shoes_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // size_wear_option
    await queryInterface.createTable("size_wear_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // todouhuken_option
    await queryInterface.createTable("todouhuken_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // trans_reason_option
    await queryInterface.createTable("trans_reason_option", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // banks
    await queryInterface.createTable("Banks", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      kana: Sequelize.TEXT,
      hira: Sequelize.TEXT,
      normalize: Sequelize.JSONB,
    });

    // branches
    await queryInterface.createTable("Branches", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      bank_code: {
        type: Sequelize.TEXT,
        allowNull: false,
        references: {
          model: "Banks",
          key: "code",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      code: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      kana: Sequelize.TEXT,
      hira: Sequelize.TEXT,
      normalize: Sequelize.JSONB,
    });

    // points_uriage_over
    await queryInterface.createTable("points_uriage_over", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      points_180: Sequelize.INTEGER,
      uriagekin_180: Sequelize.INTEGER,
      points_confiscated: Sequelize.INTEGER,
      uriagekin_confiscated: Sequelize.INTEGER,
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

    // blog
    await queryInterface.createTable("blog", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: Sequelize.TEXT,
      content: Sequelize.TEXT,
      summary: Sequelize.TEXT,
      mokuji: Sequelize.TEXT,
      image_url: Sequelize.TEXT,
      views_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      views_24h: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      public: Sequelize.BOOLEAN,
      uploaded_date: Sequelize.DATE,
      blog_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "blog_category_option",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      item_category1_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "item_category1_option",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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

    // journal
    await queryInterface.createTable("journal", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      kanjyo_kari1: {
        type: Sequelize.INTEGER,
        references: {
          model: "kanjyo_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      kanjyo_kari2: {
        type: Sequelize.INTEGER,
        references: {
          model: "kanjyo_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      kanjyo_kashi1: {
        type: Sequelize.INTEGER,
        references: {
          model: "kanjyo_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      kanjyo_kashi2: {
        type: Sequelize.INTEGER,
        references: {
          model: "kanjyo_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      reason_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "journal_reason_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      price_kari1: Sequelize.INTEGER,
      price_kari2: Sequelize.INTEGER,
      price_kashi1: Sequelize.INTEGER,
      price_kashi2: Sequelize.INTEGER,
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

    // user
    await queryInterface.createTable("user", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_name: Sequelize.TEXT,
      user_introduction: Sequelize.TEXT,
      profile_image: Sequelize.TEXT,
      penalty_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      early_seller: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      honnin_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      campaign_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      campaign_points_sum: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      uriagekin: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      star_amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      star_average: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      gender_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      birthday: Sequelize.DATE,
      phone_number: Sequelize.TEXT,
      honnin_verify_request: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    // id_card
    await queryInterface.createTable("id_card", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      id_card_front: Sequelize.TEXT,
      id_card_rear: Sequelize.TEXT,
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // transfar
    await queryInterface.createTable("transfar", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      all_money: Sequelize.INTEGER,
      handling_charge: Sequelize.INTEGER,
      trans_money: Sequelize.INTEGER,
      trans_reason_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "trans_reason_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      trans_finish: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      trans_schedule_date: Sequelize.DATE,
      trans_date: Sequelize.DATE,
      transfar_id: {
        type: Sequelize.CHAR(22),
        unique: true,
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

    // item
    await queryInterface.createTable("item", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.TEXT,
      explain: Sequelize.TEXT,
      image_url: Sequelize.ARRAY(Sequelize.TEXT),
      category_text: Sequelize.TEXT,
      price: Sequelize.INTEGER,
      sort_number: Sequelize.DECIMAL,
      views_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      views_24h: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      stock_all: Sequelize.INTEGER,
      stock_now: Sequelize.INTEGER,
      stock_20: Sequelize.DECIMAL,
      sold_out: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      draft: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      not_finish: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      checked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      early_sell: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      item_condetion_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "item_condition_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      seller_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      uploaded_date: Sequelize.DATE,
      search_text: Sequelize.TEXT,
      sort_buzz_number: Sequelize.DECIMAL,
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      deleted_at: Sequelize.DATE,
      first_image_url: Sequelize.TEXT,
      save_at: Sequelize.DATE,
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

    // video
    await queryInterface.createTable("video", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      thumbnail_url: Sequelize.TEXT,
      title: Sequelize.TEXT,
      summary: Sequelize.TEXT,
      duration: Sequelize.TEXT,
      original_url: Sequelize.TEXT,
      converted_url: Sequelize.TEXT,
      status: Sequelize.TEXT,
      play_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "item",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // sale
    await queryInterface.createTable("sale", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      before_price: Sequelize.INTEGER,
      discount_rate: Sequelize.INTEGER,
      discount_amount: Sequelize.INTEGER,
      sale_flag: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "item",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // item_report
    await queryInterface.createTable("item_report", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "item",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      report_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      option_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "item_report_option",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // comment
    await queryInterface.createTable("comment", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sort_number: {
        type: Sequelize.DECIMAL,
        allowNull: false,
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
      parent_comment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "comment",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      pin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    // comment_report
    await queryInterface.createTable("comment_report", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      comment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "comment",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      report_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      option_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "comment_report_option",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // color_size
    await queryInterface.createTable("color_size", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      kind: Sequelize.TEXT,
      color: Sequelize.TEXT,
      size: Sequelize.TEXT,
      image_url: Sequelize.TEXT,
      stock_all: Sequelize.INTEGER,
      stock_now: Sequelize.INTEGER,
      size_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "size_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      size_wear_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "size_wear_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      size_shoes_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "size_shoes_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "item",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // category
    await queryInterface.createTable("category", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "item",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      category1_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "item_category1_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      camp_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "category_camp_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      hike_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "category_hike_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      wear_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "category_wear_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      other_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "category_other_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
    });

    // reccomend_month
    await queryInterface.createTable("reccomend_month", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      paid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      will_cancel: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // reccomend_item
    await queryInterface.createTable("reccomend_item", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      reccomend_month: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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

    // reccomend_paid_info
    await queryInterface.createTable("reccomend_paid_info", {
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
      },
      reccomend_month_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "reccomend_month",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reccomend_item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "reccomend_item",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      pay_id: Sequelize.CHAR(20),
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

    // shop_info
    await queryInterface.createTable("shop_info", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      company_name: Sequelize.TEXT,
      shop_name: Sequelize.TEXT,
      email: Sequelize.TEXT,
      phone_number: Sequelize.TEXT,
      homepage_url: Sequelize.TEXT,
      open_date_time: Sequelize.TEXT,
      company_number: Sequelize.TEXT,
      id_card_front: Sequelize.TEXT,
      id_card_rear: Sequelize.TEXT,
      capital: Sequelize.INTEGER,
      menber_count: Sequelize.INTEGER,
      request_all: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      auto_trans: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      open_info: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      com_or_free_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "com_or_free_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      founded_date: Sequelize.DATE,
      permit_url: Sequelize.ARRAY(Sequelize.TEXT),
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

    // shop_info_edit
    await queryInterface.createTable("shop_info_edit", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      company_name: Sequelize.TEXT,
      company_number: Sequelize.TEXT,
      id_card_front: Sequelize.TEXT,
      id_card_rear: Sequelize.TEXT,
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      shop_info_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "shop_info",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      com_or_free_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "com_or_free_option",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // paid_info
    await queryInterface.createTable("paid_info", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      price: Sequelize.INTEGER,
      total_amount: Sequelize.INTEGER,
      points_used: Sequelize.INTEGER,
      sales_commission_amount: Sequelize.INTEGER,
      gain_amount: Sequelize.INTEGER,
      item_count: Sequelize.INTEGER,
      paid_ok: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      trans_finish: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      cancel: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      return_item: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      payment_method_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "payment_method_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "item",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      color_size_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "color_size",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      seller_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      buyer_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      buy_date: Sequelize.DATE,
      paid_date: Sequelize.DATE,
      pay_id: Sequelize.CHAR(24),
      item_name: Sequelize.TEXT,
      item_image: Sequelize.TEXT,
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

    // chat
    await queryInterface.createTable("chat", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      seller_username: Sequelize.TEXT,
      seller_chat: Sequelize.TEXT,
      buyer_username: Sequelize.TEXT,
      buyer_chat: Sequelize.TEXT,
      paid_info_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "paid_info",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // cancel
    await queryInterface.createTable("cancel", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      cancel_reason: Sequelize.TEXT,
      return_amount: Sequelize.INTEGER,
      item_count: Sequelize.INTEGER,
      cancel_flag: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cancel_fee_return_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "cancel_fee_return_option",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      paid_info_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "paid_info",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // delivery
    await queryInterface.createTable("delivery", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      buyer_phone_number: Sequelize.TEXT,
      cancel: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      shipping_day_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "shipping_day_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      shipping_service_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "shipping_service_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      delivery_status_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "delivery_status_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      shipping_place_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "shipping_place_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      parent_data_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "delivery",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      paid_info_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "paid_info",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "item",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      color_size_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "color_size",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      seller_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      buyer_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      buy_date: Sequelize.DATE,
      shipping_date: Sequelize.DATE,
      arrived_date: Sequelize.DATE,
      arrive_specified_date: Sequelize.DATE,
      parent_data: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    // name
    await queryInterface.createTable("name", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      sei: Sequelize.TEXT,
      mei: Sequelize.TEXT,
      sei_kana: Sequelize.TEXT,
      mei_kana: Sequelize.TEXT,
      shop_info_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "shop_info",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      shop_info_edit_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "shop_info_edit",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      delivery: {
        type: Sequelize.INTEGER,
        references: {
          model: "delivery",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // address
    await queryInterface.createTable("address", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      post_number: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      todouhuken_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "todouhuken_option",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      shikutyouson: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      banchi: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      building: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      shop_info_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "shop_info",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      shop_info_edit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "shop_info_edit",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      delivery_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "delivery",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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

    // bank_account
    await queryInterface.createTable("bank_account", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      bank_name: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      branch: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      account_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "account_type_option",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      account_number: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      meigi: {
        type: Sequelize.TEXT,
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
        onDelete: "SET NULL",
      },
      shop_info_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "shop_info",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      transfar_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "transfar",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      bank_code: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      branch_code: {
        type: Sequelize.TEXT,
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

    // item_buyer_report
    await queryInterface.createTable("item_buyer_report", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "item",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      report_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      option_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "item_buyer_report_option",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      detail_text: Sequelize.TEXT,
      paid_info_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "paid_info",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      checked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    // reference_code
    await queryInterface.createTable("reference_code", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      input: Sequelize.TEXT,
      output: Sequelize.TEXT,
      input_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      output_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      checked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    // search
    await queryInterface.createTable("search", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      search_text: Sequelize.TEXT,
      category_text: Sequelize.TEXT,
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // notification
    await queryInterface.createTable("notification", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      message_image: Sequelize.TEXT,
      read_flag: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      read_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      url: Sequelize.TEXT,
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

    // inquiry
    await queryInterface.createTable("inquiry", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // follow
    await queryInterface.createTable("follow", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      follow_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      follower_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // cart
    await queryInterface.createTable("cart", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
      addtocart_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // good_item
    await queryInterface.createTable("good_item", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
      good_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // good_comment
    await queryInterface.createTable("good_comment", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      comment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "comment",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      good_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // watch_history
    await queryInterface.createTable("watch_history", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // uriagekin_history
    await queryInterface.createTable("uriagekin_history", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      uriagekin: Sequelize.INTEGER,
      used_uriagekin: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // sales_history
    await queryInterface.createTable("sales_history", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      item_count: Sequelize.INTEGER,
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "item",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      seller_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // star_history
    await queryInterface.createTable("star_history", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      star: Sequelize.INTEGER,
      seller_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      buyer_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // points_history
    await queryInterface.createTable("points_history", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      points: Sequelize.INTEGER,
      used_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // UserDeleteLogs
    await queryInterface.createTable("UserDeleteLogs", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      delete_reason: Sequelize.TEXT,
      delete_by_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      admin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      ip_address: Sequelize.TEXT,
      user_agent: Sequelize.TEXT,
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

    // PointConversionLogs
    await queryInterface.createTable("PointConversionLogs", {
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
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // ItemDeletedLogs
    await queryInterface.createTable("ItemDeletedLogs", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
      delete_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      delete_by_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      delete_reason: Sequelize.TEXT,
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

    // DeletedOrderSystems
    await queryInterface.createTable("DeletedOrderSystems", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      paid_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "paid_info",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      delivery_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "delivery",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      cancel_reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      refund_status: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      refund_method: Sequelize.TEXT,
      refund_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      deleted_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // DeletedItems
    await queryInterface.createTable("DeletedItems", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      item_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      explain: Sequelize.TEXT,
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      image_url: Sequelize.ARRAY(Sequelize.TEXT),
      video_url: Sequelize.TEXT,
      thumbnail_url: Sequelize.TEXT,
      video_title: Sequelize.TEXT,
      video_summary: Sequelize.TEXT,
      parent_delivery_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "delivery",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      delete_reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      deleted_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
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

    // SignupVerificationTokens
    await queryInterface.createTable("SignupVerificationTokens", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      verification_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      verification_code_expires: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      reissue_token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reissue_token_expires: {
        type: Sequelize.DATE,
        allowNull: false,
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

    // PasswordResetTokens
    await queryInterface.createTable("PasswordResetTokens", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      token_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
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

    // EmailChangeTokens
    await queryInterface.createTable("EmailChangeTokens", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      token_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
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
      new_email: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    await queryInterface.dropTable("EmailChangeTokens");
    await queryInterface.dropTable("PasswordResetTokens");
    await queryInterface.dropTable("SignupVerificationTokens");
    await queryInterface.dropTable("DeletedItems");
    await queryInterface.dropTable("DeletedOrderSystems");
    await queryInterface.dropTable("ItemDeleteLogs");
    await queryInterface.dropTable("PointConversionLogs");
    await queryInterface.dropTable("UserDeleteLogs");
    await queryInterface.dropTable("points_history");
    await queryInterface.dropTable("sales_history");
    await queryInterface.dropTable("star_history");
    await queryInterface.dropTable("uriagekin_history");
    await queryInterface.dropTable("watch_history");
    await queryInterface.dropTable("good_comment");
    await queryInterface.dropTable("good_item");
    await queryInterface.dropTable("cart");
    await queryInterface.dropTable("follow");
    await queryInterface.dropTable("inquiry");
    await queryInterface.dropTable("notification");
    await queryInterface.dropTable("search");
    await queryInterface.dropTable("reference_code");
    await queryInterface.dropTable("item_buyer_report");
    await queryInterface.dropTable("bank_account");
    await queryInterface.dropTable("address");
    await queryInterface.dropTable("name");
    await queryInterface.dropTable("delivery");
    await queryInterface.dropTable("cancel");
    await queryInterface.dropTable("chat");
    await queryInterface.dropTable("paid_info");
    await queryInterface.dropTable("shop_info_edit");
    await queryInterface.dropTable("shop_info");
    await queryInterface.dropTable("reccomend_paid_info");
    await queryInterface.dropTable("reccomend_item");
    await queryInterface.dropTable("reccomend_month");
    await queryInterface.dropTable("category");
    await queryInterface.dropTable("color_size");
    await queryInterface.dropTable("comment_report");
    await queryInterface.dropTable("comment");
    await queryInterface.dropTable("item_report");
    await queryInterface.dropTable("sale");
    await queryInterface.dropTable("video");
    await queryInterface.dropTable("item");
    await queryInterface.dropTable("transfar");
    await queryInterface.dropTable("id_card");
    await queryInterface.dropTable("user");
    await queryInterface.dropTable("journal");
    await queryInterface.dropTable("blog");
    await queryInterface.dropTable("points_uriage_over");
    await queryInterface.dropTable("Branches");
    await queryInterface.dropTable("Banks");
    await queryInterface.dropTable("account_type_option");
    await queryInterface.dropTable("blog_category_option");
    await queryInterface.dropTable("cancel_fee_return_option");
    await queryInterface.dropTable("category_camp_option");
    await queryInterface.dropTable("category_hike_option");
    await queryInterface.dropTable("category_other_option");
    await queryInterface.dropTable("category_wear_option");
    await queryInterface.dropTable("com_or_free_option");
    await queryInterface.dropTable("comment_report_option");
    await queryInterface.dropTable("delivery_status_option");
    await queryInterface.dropTable("gender_option");
    await queryInterface.dropTable("item_buyer_report_option");
    await queryInterface.dropTable("item_category1_option");
    await queryInterface.dropTable("item_condition_option");
    await queryInterface.dropTable("item_report_option");
    await queryInterface.dropTable("journal_reason_option");
    await queryInterface.dropTable("kanjyo_option");
    await queryInterface.dropTable("payment_method_option");
    await queryInterface.dropTable("shipping_day_option");
    await queryInterface.dropTable("shipping_service_option");
    await queryInterface.dropTable("shipping_place_option");
    await queryInterface.dropTable("size_option");
    await queryInterface.dropTable("size_shoes_option");
    await queryInterface.dropTable("size_wear_option");
    await queryInterface.dropTable("todouhuken_option");
    await queryInterface.dropTable("trans_reason_option");
  },
};
