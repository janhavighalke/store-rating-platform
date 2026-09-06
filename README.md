# RATEORA - Store Experience

RATEORA is a full-stack store rating platform that allows customers to discover stores, submit ratings, and manage their rating activity. Store owners can monitor their store's overall performance, while administrators can manage users, stores, and ratings.

## Features

### Admin

- View dashboard statistics
- View total users, stores, and ratings
- Add normal users
- Add administrators
- Add store owners
- Add stores
- Assign store owners to stores
- View all users
- Search and filter users
- Sort users
- View user details
- Delete users
- View all stores
- Search and filter stores
- Sort stores
- View store details
- View individual customer ratings
- Delete stores
- Logout

### Normal User

- Register an account
- Login securely
- View all available stores
- Search stores by name
- Search stores by address
- View overall store ratings
- View personal submitted rating
- Submit a rating from 1 to 5
- Modify an existing rating
- View personal rating activity
- Change password
- Logout

### Store Owner

- Login securely
- View assigned store information
- View average store rating
- View number of customers who rated the store
- View customer activity
- View customer names and email addresses
- View rating dates
- Individual numeric customer ratings are not displayed to store owners
- Change password
- Logout

## User Roles

RATEORA supports three user roles:

### Admin

Manages users, stores, store owners, and ratings.

### Normal User

Searches stores and submits or modifies ratings.

### Store Owner

Monitors their store's rating performance.

## Demo Login Credentials

The following sample credentials can be used to test the three application roles.

### Admin

Email: admin@example.com

Password: Admin@123

### Store Owner

Email: sakshi@gmail.com

Password: Janhavi@18

### Normal User

Email: deeya@gmail.com

Password: Janhavi@18

> These are sample demo credentials provided for testing and demonstration purposes. The accounts must exist in the application's MySQL database before they can be used to log in.

## Testing the Roles

### Admin

Login using the Admin credentials to test:

- Dashboard statistics
- User management
- Store owner management
- Store management
- Individual customer ratings
- User and store deletion

### Store Owner

Login using the Store Owner credentials to test:

- Store information
- Average rating
- Customer count
- Customer activity
- Password management

Store owners cannot see individual numeric ratings submitted by customers.

### Normal User

Login using the Normal User credentials to test:

- Store search
- Store ratings
- Rating submission
- Rating modification
- Personal rating activity
- Password management

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
- CORS

### Database

- MySQL

### Development Tools

- VS Code
- Git
- GitHub
- MySQL / MySQL Workbench

## Project Structure

```text
store-rating-platform/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── ownerController.js
│   │   ├── ratingController.js
│   │   └── storeController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── ownerRoutes.js
│   │   ├── ratingRoutes.js
│   │   └── storeRoutes.js
│   │
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── database/
│   └── schema.sql
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── OwnerPassword.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── UserPassword.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md