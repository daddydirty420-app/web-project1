# マイグレーション作成マニュアル

## マイグレーションファイル作成

/serverのコマンドで実行

```bash
npx sequelize-cli migration:generate --name ファイル名（適当に）
```

## マイグレーションファイルの書き方

### CommonJSからESMへの書き換え

npx sequelize-cli migration:generateだと、CommonJSでファイルが生成されるが、package.jsonに"type": "module"と設定しているため、**マイグレーションファイルをCommonJSからESMに書き換える必要がある**。

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

**module.exports =**の部分を**export default**に書き換えるだけ！

### テーブル作成

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
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

```js
export default {
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

### カラム削除

```js
export default {
    async up (queryInterface, Sequelize) {
        await queryInterface.removeColumn("テーブル名", "カラム名");
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.addColumn("テーブル名", "カラム名", {
            制約

            Example:
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        });
    }
};
```

### 外部キー追加

```js
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

```bash
npx sequelize-cli db:migrate
```

---

## AI特記事項

### 基本方針

- Model（init）を唯一の正（Single Source of Truth）とする。
- migrationは必ずModelに忠実に作成すること。
- migrationのみを変更してはいけない。
- Modelに定義されている型・allowNull・defaultValue・unique・references・onDelete・onUpdateなどの制約を漏れなくmigrationへ反映すること。
- Modelに存在しない制約や独自判断による仕様追加は行わない。
- Modelのtimestamps: trueはORMの動作設定であり、migrationではcreatedAt・updatedAtを明示的に定義すること。
- 複数処理する場合は必ずtransactionをつける

### createdAt / updatedAt

Modelでは通常のカラムとして定義されているが、migrationでは必ず以下の形式で実装する

```js
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
```
