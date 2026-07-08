"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("point_reason_option", [
            {
                name: "商品購入",
            },
            {
                name: "キャンペーン",
            },
            {
                name: "ポイント変換",
            },
            {
                name: "商品キャンセル",
            },
            {
                name: "返品",
            },
            {
                name: "運営調整",
            },
            {
                name: "有効期限切れ",
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("point_reason_option", null, {});
    },
};
