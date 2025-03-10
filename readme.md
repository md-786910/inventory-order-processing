# Order Processing System

## Overview

This project is a **scalable, event-driven Order Processing System** built using **Node.js, Express, MongoDB, Redis, and AWS**. The system allows users to place orders, processes them asynchronously, and sends notifications upon completion.

## Features

- **User Authentication**: JWT-based authentication with refresh tokens.
- **Order Management**: Create and retrieve orders with status tracking.
- **Inventory Check**: Ensures stock availability before order confirmation.
- **Asynchronous Processing**: Uses AWS SQS for background order processing.
- **Caching**: Implements Redis for fast order retrieval.
- **Email Notifications**: Sends order confirmation via AWS SES.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **Queue Management**: AWS SQS
- **Email Service**: AWS SES
- **Authentication**: JWT (JSON Web Tokens)
- **Environment Configurations**: `.env` file for sensitive data

## System Architecture

1. **Client/User**
   - Places an order via API
   - Receives confirmation email

2. **Order Service (Express.js + MongoDB)**
   - Handles order creation
   - Validates inventory
   - Pushes order to AWS SQS

3. **Order Processor Worker (Node.js Service)**
   - Reads from AWS SQS
   - Updates order status
   - Caches order in Redis
   - Sends an email notification via AWS SES

4. **AWS Services**
   - **SQS**: Manages async processing queue
   - **SES**: Sends email notifications

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### Order Management
- `POST /api/orders` - Create an order
- `GET /api/orders/:id` - Retrieve order details

## Setup Instructions

### Prerequisites
- **Node.js** (v16+)
- **MongoDB** (local or Atlas)
- **Redis** (local or cloud)
- **AWS SQS & SES** (configured with credentials)

### Installation
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd inventory-order-processing
   npm install

   Create a .env file in the root directory
   # Server
   PORT=3000
   NODE_ENV=development
   
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/order-processing
   
   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379
   
   # JWT
   JWT_SECRET=myprivatesec123
   JWT_REFRESH_SECRET=myrefresh_secret
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   
   # AWS
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   AWS_SQS_QUEUE_URL=
   AWS_SES_FROM_EMAIL=

   OPENAI_API_KEY=
   
   npm run dev


