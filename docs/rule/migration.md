# マイグレーション作成マニュアル

## マイグレーションファイル作成

```
npx sequelize-cli migration:generate --name ファイル名（適当に）
```

## マイグレーションファイルの書き方

```
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable("テーブル名", {
            追加するカラム

            Example:
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable("テーブル名");
    }
};
```

このタイミングでdevelopにgit pushしても可

## マイグレーション実行
