# マイグレーション作成マニュアル

## マイグレーションファイル作成

```
npx sequelize-cli migration:generate --name ファイル名（適当に）
```

## マイグレーションファイルの書き方

### CommonJSからESMへの書き換え

npx sequelize-cli migration:generateだと、CommonJSでファイルが生成されるが、package.jsonに"type": "module"と設定しているため、**マイグレーションファイルをCommonJSからESMに書き換える必要がある**。

```
CommonJS
module.exports = {
    async up(...) {
        ...
    },

    async down(...) {
        ...
    },
};

ESM
export default {
    async up(...) {
        ...
    },

    async down(...) {
        ...
    },
};

```

**module.exports =**の部分を**export default**に書き換えるだけ！

### テーブル作成

```
'use strict';

/** @type {import('sequelize-cli').Migration} */
export default = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable("テーブル名", {
            カラム

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

### カラム追加

```
export default = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addColumn("テーブル名", "カラム名", {
            制約

            Example:
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.removeColumn("テーブル名", "カラム名");
    }
};
```

### 外部キー追加

```
export default {
    async up (queryInterface, Sequelize) {
        await queryInterface.addConstRaint("テーブル名", {
            外部キー制約

            Example:
            fields: ["カラム名"],
            type: "foreign key",
            name: "fk_points_history_カラム名", // 制約名
            references: {
                table: "リレーション先テーブル名",
                field: "id（主キー）",
            },
            onUpdate: "",
            onDelete: "",
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.removeConstraint("テーブル名", "制約名");
    }
};
```

#### onUpdate, onDelete

```
CASCADE    親レコードが削除されたら子レコードも削除
SET NULL   外部キーをNULLにする
RESTRICT   子レコードがある場合削除禁止
```


## マイグレーション実行

/serverのコマンドで実行

```
npx sequelize-cli db:migrate
```
