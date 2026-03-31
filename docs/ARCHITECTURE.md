🇯🇵 Japanese version: ARCHITECTURE.ja.md

# Architecture

## Overview

This project is an EC platform where product listing requires video upload.

Main goals:

* Multi-category EC platform
* Video-based product listings
* Designed for future mobile app expansion
* Designed for AI / ML integration

---

# System Architecture

## Frontend

Framework

* Next.js (App Router)
* TypeScript

Responsibilities

* UI rendering
* API communication
* Video upload
* Product browsing
* Purchase flow

Directory structure

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

## Backend

Framework

* Node.js
* Express
* Sequelize ORM

Responsibilities

* API server
* Business logic
* Payment processing
* Order management
* Delivery management

Directory structure

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

# Database

Database

* PostgreSQL

ORM

* Sequelize

Main tables

User
Item
Order
Delivery

Relationships

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

# Order Flow

Purchase process

pending
↓
paid
↓
shipped
↓
completed

Possible exits

cancelled
returned

---

# Future Architecture Plans

Planned improvements

* multi-catogory UI
* mobile app
* ML recommendation system
* automatic moderation
* payment gateway integration
* shipping API integration
