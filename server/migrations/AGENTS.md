# マイグレーション作成ルール

## 基本方針

- `/server/src/model` のModel定義を唯一の正とする。
- migrationはModelに忠実に作成し、型・NULL制約・初期値・一意制約・外部キー制約を漏れなく反映する。
- Modelに存在しない制約や仕様を独自判断で追加しない。
- migration作成のためにModelを変更しない。
- 既存のmigrationファイルを参照し、命名・記述形式・制約名を統一する。
- CommonJSではなくESM形式の `export default` で記述する。
- `up` と `down` の両方を必ず実装する。
- migrationの作成のみを行い、実行はしない。

## Modelから反映する項目

以下の定義を必ず確認し、migrationへ反映する。

- `type`
- `allowNull`
- `defaultValue`
- `unique`
- `references`
- `onUpdate`
- `onDelete`
- `primaryKey`
- `autoIncrement`

外部キーの削除・更新ルールがModelだけでは判断できない場合は、同じ役割を持つ既存のModelおよびmigrationを参照する。独自判断で決定しない。

## createdAt / updatedAt

`timestamps: true` はORMの動作設定であるため、テーブル作成migrationでは `createdAt` と `updatedAt` を明示的に定義する。

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

## トランザクション

1つのmigration内で複数のテーブル・カラム・制約を変更する場合は、原則としてtransaction内で実行する。

`up` または `down` の途中で失敗した場合に、一部の変更だけがDBへ残らないようにする。

## downの方針

- `down` では `up` の処理を逆順で元に戻す。
- 外部キー制約がある場合は、必要に応じて制約を先に削除してからカラムやテーブルを削除する。
- `up` で追加したテーブル・カラム・制約を漏れなく削除する。
- `up` で削除したカラムを復元する場合は、削除前と同じ定義を使用する。

## 禁止事項

- migrationの実行
- `sequelize.sync()` の実行
- DBの初期化、リセット、データ削除
- Modelに存在しない制約の追加
- 依頼されていないModelや既存migrationの変更
- 既存migrationファイルの書き換え
- `up` のみの実装
- CommonJS形式での作成
