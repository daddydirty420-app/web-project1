🇺🇸 English version: DATABASE.en.md

# データベース

## 概要

このシステムは商品データに動画データが紐づいている単品購入型のECプラットフォームです。

* 商品データに動画やコメントなどをリレーション
* 1注文 = 1商品
* 商品情報は購入後も変わらないようスナップショットを保持

---

## 簡易DB相関図

- User
   |- ShopInfo
   |- Address
   |- Name
   |- BankAccount
   |- PointsHistory
   |- UriagekinHistory
   |- Item
   |   |- Video
   |   |- Comment
   |   |- Sale
   |   |- ItemReport
   |----- Order
            |- Delivery
            |     |- Address
            |     |- Name
            |- Cancel
            |- Chat
            |- PaymentMethodOption
            |- User(Seller)
            |- User(Buyer)
            |- purchase_snapshot
            |- status(enum)

---

## コアエンティティ

### User

ユーザー情報を管理

---

### Item

商品情報

* 出品者(seller_id)と紐づく
* 動画(Video)必須

---

### Order

注文トランザクション

* 1レコード = 1決済
* 決済データ、進行ステータス、スナップショットを格納
* 配送(Delivery)、キャンセル(Cancel)、取引チャット(Chat)と紐づく

---

## 重要リレーション

### Order - Item

* 1 : 1
* 商品は購入後に変更される可能性があるため、
購入時点の情報は purchase_snapshot に保存する

---

### Order - Delivery

* 1 : 1
* 配送情報は購入単位で保持

---

### Order - Cancel

* 1 : 0..1
* キャンセルが発生した場合のみ作成

---

### Order - PaymentMethodOption

* N : 1
* 決済方法はマスターデータから選択する

---

### Order - User（Seller / Buyer）

* N : 1
* Sellerは商品出品者、Buyerは購入者を表す
* 取引の当事者を明確に分離するために両方を保持する

---

### Item - Video

* 1 : 1
* 商品には1つの動画が紐づく（動画必須）

---

### Item - Comment

* 1 : N
* 商品に対するユーザーのコメントを管理

---

## 設計意図（Design Decisions）

### なぜスナップショットを持つのか

商品情報（価格・名前・説明など）は出品者によって変更される可能性があるため、
購入時点の情報を purchase_snapshot に保存することで、
過去の取引データの整合性を保つ

---

### なぜ1商品1注文にしているのか

* BtoC、CtoC両対応フリマ型プラットフォームであり、出品者と購入者の取引や配送等のトラブルを未然に軽減するため
* 決済・配送・キャンセルの処理をシンプルにするため
* トランザクションの責務を明確にするため

---

### なぜDeliveryを分離しているのか

将来的に以下の拡張を想定している：

* 配送ステータス管理
* 追跡番号の保持
* 外部配送APIとの連携

---

### なぜSellerとBuyerを両方持つのか

* 取引履歴の取得を高速化するため
* 将来的な分析（売上・購入履歴）を容易にするため

---

## 制約・ルール

* Order作成後、Itemの変更は注文データに影響しない
* Cancelは1注文につき最大1回のみ
* Deliveryは必須データ
* ItemにはVideoが1つ必要