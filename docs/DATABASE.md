🇯🇵 Japanese version: DATABASE.ja.md

# Database

## Overview

This system is a single-item purchase e-commerce platform where each item is associated with a video.

- Each item can have videos and comments
- 1 order = 1 item
- Item data is stored as a snapshot at the time of purchase to preserve historical accuracy

---

## ER Diagram (Simplified)

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
            |- User (Seller)
            |- User (Buyer)
            |- PurchaseSnapshot
            |- status (enum)

---

## Core Entities

### User

Manages user information.

---

### Item

Represents a product listed for sale.

- Associated with a seller (seller_id)
- Requires at least one video

---

### Order

Represents a purchase transaction.

- 1 record = 1 purchase
- Stores payment data, status, and snapshot data
- Associated with Delivery, Cancel, and Chat

---

## Important Relationships

### Order - Item

- 1 : 1
- Since item data can change after purchase,  
  the state at the time of purchase is stored in `PurchaseSnapshot`

---

### Order - Delivery

- 1 : 1
- Delivery information is stored per order

---

### Order - Cancel

- 1 : 0..1
- Created only when a cancellation occurs

---

### Order - PaymentMethodOption

- N : 1
- Payment methods are selected from master data

---

### Order - User (Seller / Buyer)

- N : 1 (each)
- Seller represents the item owner, Buyer represents the purchaser
- Both are stored to clearly define transaction participants

---

### Item - Video

- 1 : 1
- Each item must have one video

---

### Item - Comment

- 1 : N
- Manages user comments on items

---

## Design Decisions

### Why use a snapshot?

Item data (price, name, description, etc.) may change over time.  
To maintain consistency of past transactions,  
the data at the time of purchase is stored in `PurchaseSnapshot`.

---

### Why 1 order per item?

- Designed for a marketplace-style platform (C2C / B2C)
- Simplifies handling of payment, delivery, and cancellation
- Keeps transaction responsibility clear and isolated

---

### Why separate Delivery?

Designed with future extensions in mind:

- Delivery status tracking
- Tracking number management
- Integration with external shipping APIs

---

### Why store both Seller and Buyer?

- Improves performance when retrieving transaction history
- Enables easier future analysis (sales, purchase behavior, etc.)

---

## Constraints / Rules

- Changes to Item do not affect existing Orders
- Only one Cancel record per Order
- Delivery is required
- Each Item must have one Video