# Order Management System

## Overview
This project is a backend service for managing user authentication, order processing, inventory validation, asynchronous order processing, caching, and email notifications. It utilizes **Node.js, Express, MongoDB, Redis, AWS SQS, and AWS SES**.

## Features

### 1. User Authentication (JWT & Refresh Tokens)
- Uses **JWT** for authentication and **refresh tokens** for session management.
- API Endpoints:
  - **User Registration:** `POST /api/auth/register`
  - **User Login:** `POST /api/auth/login`
  - **Token Refresh:** `POST /api/auth/refresh`

### 2. Order Management
- Allows users to create orders with details like:
  - `orderId` (Unique Identifier)
  - `userId` (Who placed the order)
  - `items` (Array of products ordered)
  - `totalAmount`
  - `status` (Pending, Processed, Failed)
- API Endpoints:
  - **Create Order:** `POST /api/orders/create`
  - **Get Order Details:** `GET /api/orders/:id`

### 3. Inventory Check (Stock Validation Before Order Confirmation)
- Checks if items are in stock before order confirmation.
- If an item is out of stock, the order is rejected.
- Uses an **Inventory Service** (Mocked or MongoDB collection) for stock management.

### 4. Asynchronous Processing with AWS SQS
- Once an order passes inventory validation, it is pushed to an **AWS SQS queue** for processing.
- An **Order Processor Worker**:
  - Reads messages from **AWS SQS**.
  - Updates the order status to **Processed** or **Failed** based on validation.

### 5. Caching with Redis
- Order details are cached in **Redis** for fast retrieval.
- Orders expire after **10 minutes** to prevent stale data.
- If an order is not found in Redis, it is fetched from MongoDB and then cached.

### 6. Email Notifications with AWS SES
- After an order is processed, an email notification is sent using **AWS SES**.
- Email contains:
  - **Order ID**
  - **List of purchased items**
  - **Order status** (Processed/Failed)
- AWS SES is configured for sending emails using verified sender addresses.

---

## Project Setup

### Prerequisites
- **Node.js** (v16 or later)
- **MongoDB** (Local or Atlas)
- **Redis**
- **AWS SQS & SES** setup

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/r4vitej4/order-management-system.git
   cd order-management-system
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env`):
   ```sh
    PORT=
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
    MONGO_URL=
    ACCESS_TOKEN_SECRET=
    REFRESH_TOKEN_SECRET=
    AWS_REGION=ap-south-1
    AWS_ACCESS_KEY=
    AWS_SECRET_KEY=
    SQS_QUEUE_URL=
    AWS_SES_FROM_EMAIL=
   ```
4. Start the server:
   ```sh
   npm start
   ```

---

## API Usage

### User Authentication
#### Register a new user
```sh
POST /api/auth/register
```
#### Login
```sh
POST /api/auth/login
```
#### Refresh Token
```sh
POST /api/auth/refresh
```

### Order Management
#### Create Order
```sh
POST /api/orders/create
```
#### Get Order Details
```sh
GET /api/orders/:id
```

---

## Technologies Used
- **Node.js & Express.js** - Backend Framework
- **MongoDB & Mongoose** - Database
- **Redis** - Caching Layer
- **AWS SQS** - Queue Service
- **AWS SES** - Email Service
- **JWT** - Authentication

