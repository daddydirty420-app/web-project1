## 概要

以下のmodelを変更したので、migrationファイルを作成し、実装してください。migrationの実行はしないでください。また、modelに書かれていないCASCADE等のルールは、過去のパターンを参照し、適切なものを書いてください。その他、modelに書かれているリレーションやnullable、defaultValue等の制約は必ず守ってください。わからないことがあれば質問してください。

## マイグレーションファイル追加場所

/server/migrations

## 変更前提

modelファイルはすでに変更済みです。
migrationは必ず現在のmodelの定義に合わせて作成してください。

## 新規追加テーブル

- coupon
- coupon_user
- coupon_item
- coupon_shop
- coupon_category
- purchase_session

## 既存テーブル新規追加カラム

- orders.coupon_user_id

## 参照すべきmodelファイル

/server/src/models

- coupon.ts
- coupon_user.ts
- coupon_item.ts
- coupon_shop.ts
- coupon_category.ts
- purchase_session.ts
- orders.ts

## リレーション

associationも必ず確認してください。

Modelだけでなく、
association定義も確認し、
外部キー制約をmigrationへ正確に反映してください。

## 過去のマイグレーション参照方法

/server/migration を確認し、

- ファイル命名規則
- 外部キー
- onDelete
- onUpdate
- index
- timestamps
- transaction
- Sequelizeの書き方

を既存実装に合わせてください。

## 推測禁止

推測で実装しないでください。

判断できない場合は
既存実装から判断し、
それでも不明な場合は質問してください。

## 最後にセルフレビュー

実装後に以下をセルフチェックしてください。

- Modelとの差分がないか
- FKが一致しているか
- allowNullが一致しているか
- defaultValueが一致しているか
- 型が一致しているか
- downで完全に元へ戻せるか

## マイグレーション特記事項

- 必ずupだけでなくdownも作成する
- ESM形式で書く
- modelに書かれているリレーションやnullable等の制約ルールは厳密に守る
- modelに書かれていないCASCADE等のルールは、過去のmigrationからパターンを参考にして、既存実装に合わせる。わからなければ質問する。
- その他、書き方の特徴がわからなければ、過去のmigrationファイルを参考にして既存実装を参考にし、わからなければ質問する
- migrationファイルの実装のみを行い、実行はしない
- migrationファイル以外は変更しないでください。
既存のmodel・service・route・usecase・middleware等は編集しないでください。

## 技術スタック

- model: typescript
- migration: javascript
- db: postgreSQL
