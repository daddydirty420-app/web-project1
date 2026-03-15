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

/frontend
/components
/app
/lib
/hooks

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
* Chat system

Directory structure

/backend
/models
/routes
/controllers
/services

---

# Database

Database

* PostgreSQL

ORM

* Sequelize

Main tables

User
Item
PaidInfo (Order)
Delivery
Chat
Cancel

Relationships

User
├ items (seller)
└ purchases (buyer)

PaidInfo
├ item
├ seller
├ buyer
├ delivery
├ chat
└ cancel

Delivery
├ address
└ name

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

* mobile app
* ML recommendation system
* automatic moderation
* payment gateway integration
* shipping API integration
