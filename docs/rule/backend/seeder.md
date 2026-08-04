# Seeder作成マニュアル

## Seederファイル作成

/serverのコマンドで実行

```bash
npx sequelize-cli seed:generate --name ファイル名（適当に）
```

## Seederファイルの書き方

### CommonJSからESMへの書き換え

npx sequelize-cli seed:generateだと、CommonJSでファイルが生成されるが、package.jsonに"type": "module"と設定しているため、**SeederファイルをCommonJSからESMに書き換える必要がある**。

```js
// CommonJS
module.exports = {
    async up(...) {
        ...
    },

    async down(...) {
        ...
    },
};

// ESM
export default {
    async up(...) {
        ...
    },

    async down(...) {
        ...
    },
};

```

---

### レコード追加

```js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("テーブル名", [
            {
                カラム名: 内容,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("テーブル名", null, {});
    },
};
```

## シード実行

/serverのコマンドで実行

```bash
npx sequelize-cli db:seed:all
```
