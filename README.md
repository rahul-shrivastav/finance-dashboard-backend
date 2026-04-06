<div align="center"> 

# Zorvyn Dashboard API Backend
  
</div>

A RESTful backend API built using **Node.js** and **Express.js** for managing users, transactions, authentication, and analytics for financial dashboards.


## Key Features

- Authentication (Signup/Login)
- User Management and Role Based Acess Controls
- Transaction Management (Admin Only)
- Insights & Aggregation APIs
- Middleware-based Authentication & Authorization
- Rate Limiting and Pagination


## Key Decisions made

- Used `Node + Express` to create the RestAPI because its well suited for `RestAPIs` I have worked on it previously , but eager to learn any tech stack .
- Used `JWT` for auth to avoid aditional DB lookups.
- Used relational DB because tables show strong relations between `User Table` ,`Transaction table` , `Category Table` and `Role Table`.
- Used `SQLlite` instead of `Postgres` or `MySQL` because it required no additional setup and my dataset is very small ( seeded with 15 rows in transaction table )
- `Normalised` the DB to avoid anomalities
- Not created the `frontend` , my focus was purely on the backend quality as there were alot of features to implement.
- Didn't included `Unit Tests` , `Soft Delete` fucntionality and `indexing` in DB due to time limitation.
- Followed a proper folder structure and naming conventions and tried to include everything asked in the assignment , project includes all key requirements.

<div align="center"> 
  
## Tech Stack
  
</div>

- Node.js
- Express.js
- SQLlite
- JWT Authentication


## Project Structure

```bash
.
├── api-server.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── transactionRoutes.js
│   └── aggregateRoutes.js
├── controllers/
├── middleware/
└── models/
```

<div align="center"> 
  
## Architecture and DB Schema
  
</div>

<div align="center">
<img width="631" height="378" alt="Screenshot 2026-04-06 211638" src="https://github.com/user-attachments/assets/20246639-9fa5-4f51-b36f-3937d567e4e1" />
</div>

### Database Entity Summary

| Entity           | Description                                     | Key Fields                                     | Relationships                         |
| :--------------- | :---------------------------------------------- | :--------------------------------------------- | :------------------------------------ |
| **Roles**        | Defines user access levels (e.g., Admin, User). | `id`, `name`                                   | Referenced by **Users**.              |
| **Categories**   | Classification for transactions                 | `id`, `name`                                   | Referenced by **Transactions**.       |
| **Users**        | Core profile and authentication data.           | `id`, `name`, `email`, `roleId`, `status`      | Referenced by **Transactions**.       |
| **Transactions** | Individual entries for transactions             | `id`, `userId`, `categoryId`, `type`, `amount` | Belongs to a **User** & **Category**. |

<div align="center">
  
<img width="550" height="424" alt="Screenshot 2026-04-06 204131" src="https://github.com/user-attachments/assets/70e4a9f2-a412-48b7-a5cb-6d33d1fcfae6" />
</div>


<div align="center"> 
  
# Endpoints
  
</div>

## Authentication Routes

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| POST   | /auth/signup | Register new user |
| POST   | /auth/login  | Login user        |


## User Routes

| Method | Endpoint   | Description    |
| ------ | ---------- | -------------- |
| POST   | /users     | Create user    |
| GET    | /users     | Get all users  |
| GET    | /users/:id | Get user by ID |
| PUT    | /users/:id | Update user    |
| DELETE | /users/:id | Delete user    |


## Transaction Routes

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| GET    | /transactions     | Get all transactions  |
| GET    | /transactions/:id | Get transaction by ID |
| POST   | /transactions     | Create transaction    |
| PUT    | /transactions/:id | Update transaction    |
| DELETE | /transactions/:id | Delete transaction    |


## Aggregate / Insights Routes

| Method | Endpoint                         | Description             |
| ------ | -------------------------------- | ----------------------- |
| GET    | /aggregate/insights/user/:userId | User insights           |
| GET    | /aggregate/insights              | All insights (Admin)    |
| GET    | /aggregate/categories            | Category trends (Admin) |


## Setup Instructions

### 1. Clone Repository

```bash
https://github.com/rahul-shrivastav/finance-dashboard-backend.git
cd finance-dashboard-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` file

```
PORT = 5000
JWT_SECRET = your_secret_key
```

### 4. Run Server Locally with Nodemon

```bash
npm run dev
```
