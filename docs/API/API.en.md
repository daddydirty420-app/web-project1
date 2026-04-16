🇯🇵 Japanese version: API.md

# API

## API Design

- RESTful API
- JSON format
- Authentication: JWT (Bearer Token)
- Stateless design

---

## Authentication

- Uses JWT authentication
- Access token required for protected endpoints
- Token is sent via Authorization header

Example:
Authorization: Bearer <token>

---

## Core Endpoints

* GET item-page

GET /item-page/:id

* login

POST /auth/login

* signup

POST /auth/signup → POST /auth/signup-verify

* item upload

POST /item-upload/new-item-create → PATCH /item-upload-main/:id

---

## Error Handling

- Errors are returned in JSON format
- Common error codes:

AUTH_ERROR
VALIDATION_ERROR
NOT_FOUND
INTERNAL_SERVER_ERROR

---

## Order Status

- pending
- paid
- shipped
- completed
- cancelled
- returned