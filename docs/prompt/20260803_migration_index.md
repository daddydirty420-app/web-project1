## 概要

PRを参照し、以下のmodelを変更したので、migrationファイルを作成し、実装してください。migrationの実行はしないでください。わからないことがあれば質問してください。

## マイグレーションファイル追加場所

/server/migrations

## 変更前提

modelファイルはすでに変更済みです。
migrationは必ず現在のmodelの定義に合わせて作成してください。

## 変更箇所

最新のPRから、server/src/modelsの変更を読み、マイグレーションを書いてください。modelの変更は複合uniqueの追加のみやってます・

### 変更ファイル

server/src/models

- coupon_user
- coupon_item
- coupon_shop
- coupon_category

## 変更ルール

変更ルールは docs/rule/backend/migration.md のAI特記事項の部分や、 docs/rule/backend/db_architect.md に書いてあります。

### 推測禁止

推測で実装しないでください。

判断できない場合は
既存実装から判断し、
それでも不明な場合は質問してください。

## 最後にセルフレビュー

実装後に以下をセルフチェックしてください。

- Modelとの差分がないか
- downで完全に元へ戻せるか
- 複合uniqueの変更箇所と違う変更がなされていないか

## マイグレーション特記事項

- 必ずupだけでなくdownも作成する
- ESM形式で書く
- PRにある複合uniqueの変更箇所だけmigrationを作成する
- migrationファイルの実装のみを行い、実行はしない
- migrationファイル以外は変更しないでください。
  既存のmodel・service・route・usecase・middleware等は編集しないでください。

## 技術スタック

- model: typescript
- migration: javascript
- db: postgreSQL
