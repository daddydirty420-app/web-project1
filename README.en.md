🇯🇵 Japanese version: README.md

# Web Project 1

## Overview

This project is a **video-first EC platform** where product listings require video uploads as part of the product information.
It supports both **BtoC and CtoC transactions**, allowing sellers to present products through video along with structured product data.

Traditional EC platforms rely mainly on images and text, which can lead to insufficient product understanding.
By requiring video as part of the product information, this platform aims to provide richer product context and improve matching between sellers and buyers.

This project is currently under development.

---

# Main Goals

1. **Video-based product listings**
   Product listing requires a video upload to provide richer product information.

2. **Mobile-first single-screen product page**

   On mobile devices, the key elements of the product page —  
   **video, product information, and purchase actions — are designed to fit within a single screen view.**

   This allows users to understand the product and access purchase actions without scrolling.

3. **Dual UI product listing**
   Product lists can switch between:

   * **Video thumbnail view**
   * **Product card view**

4. **Scalable multi-category architecture**
   Currently focused on apparel, but designed with an architecture that can expand to multiple product categories.

---

# UI Overview

### Item Page

<img src="images/readme_UI_mobile.png" width="300">

On mobile devices, the product page is designed so that
the video, product information, and purchase actions
fit within a single screen.

<img src="images/readme_UI_pc.png" width="600">

---

# Tech Stack

Frontend

* Next.js (App Router)
* TypeScript

Backend

* Node.js
* Express
* Sequelize ORM

Database

* PostgreSQL

---

# Project Structure

web-project1

/client
Frontend application (Next.js)

/server
Backend API (Node.js + Express)

/docs
Architecture and technical documentation

---

# Setup

Clone repository

git clone https://github.com/daddydirty420-app/web-project1

Install dependencies

cd client
npm install

cd ../server
npm install

Run development servers

client
npm run dev

server
npm run dev

---

# Current Features

* Product page
* Product upload
* User authentication
* User profile
* Product list
* Follow system
* Comment system
* Shop registration
* Bank transfer related features
* Contact system
* User guide
* Terms and policy pages

---

# Upcoming Implementation

* Order / payment / transaction system
* Notifications and email system
* Top page and landing page
* Admin tools

---

# Future Plans

* Mobile application
* Recommendation system
* Machine learning integration
* Multi-category expansion
* Shipping API integration
* Payment gateway integration

---

# Author

GitHub
https://github.com/daddydirty420-app
