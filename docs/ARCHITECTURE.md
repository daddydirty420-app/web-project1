🇺🇸 English version: ARCHITECTURE.en.md

# アーキテクチャ

## 概要

本プロジェクトは、商品出品時に動画アップロードを必須とするECプラットフォームです。

主な目的：

- マルチカテゴリ対応のECプラットフォーム
- 動画ベースの商品出品
- 将来的なモバイルアプリ展開を前提とした設計
- AI / 機械学習との統合を見据えた設計

---

# システム構成

## フロントエンド

フレームワーク

- Next.js（App Router）
- TypeScript

役割

- UIの描画
- API通信
- 動画アップロード
- 商品閲覧
- 購入フローの実装

ディレクトリ構成

/client/src
/app
/assets
/components
/hooks
/lib
/providers
/styles
/types

---

## バックエンド

フレームワーク

- Node.js
- Express
- Sequelize ORM

役割

- APIサーバー
- ビジネスロジックの実装
- 決済処理
- 注文管理
- 配送管理

ディレクトリ構成

/server/src
/controllers
/cron
/middleware
/models
/routes
/scripts
/services
/types
/utils

---

# データベース

データベース

- PostgreSQL

ORM

- Sequelize

主要テーブル

User
Item
Order
Delivery

リレーション

User

- item
- cart
- commentLike
- follow
- itemLike
- notification
- shopInfo
- address
- bankAccount
- name
- watchHistory

Item

- user
- category
- brand
- cart
- itemLike
- video
- sale
- itemReport
- itemShippingProfile
- comment

Order

- item
- seller
- buyer
- delivery
- chat
- cancel

Delivery

- order
- address
- name

---

# 注文フロー

購入プロセス

pending
↓
paid
↓
shipped
↓
completed

分岐

cancelled
returned

---

# 今後のアーキテクチャ拡張

予定している改善

- マルチカテゴリ対応
- モバイルアプリ対応
- レコメンド機能（機械学習）
- 自動モデレーション
- 決済ゲートウェイ統合
- 配送API統合
