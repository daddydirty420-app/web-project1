'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert("uriagekin_reason_option", [
            {
                name: "商品売上",
            },
            {
                name: "口座振込",
            },
            {
                name: "ポイント変換",
            },
            {
                name: "運営調整",
            },
            {
                name: "有効期限切れ",
            },
        ]);
  },

  async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete("uriagekin_reason_option", null, {});
  }
};
