# RATEORA - Store Experience

RATEORA is a full-stack store rating platform where users can rate stores and store owners can view their store's rating performance.

## Features

### Admin
- View dashboard statistics
- Add users
- Add administrators
- Add store owners
- Add stores
- View and filter users
- View user details
- View store details
- View individual customer ratings
- Delete users and stores
- Logout

### Normal User
- Register and login
- View all stores
- Search stores by name or address
- Submit ratings from 1 to 5
- Modify submitted ratings
- View personal rating activity
- Change password
- Logout

### Store Owner
- Login
- View store information
- View average store rating
- View number of customers who rated the store
- View customer activity
- Change password
- Logout

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- bcryptjs

### Database
- MySQL

## Project Structure

```text
store-rating-platform/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── database/
│   └── schema.sql
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md