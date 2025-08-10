# Project Management Backend (Express + MongoDB)

## Setup
1. Copy `.env.example` -> `.env` and edit:

PORT=5000
MONGO_URI=mongodb://localhost:27017/pm_db
JWT_SECRET=jwtsecret
JWT_EXPIRES_IN=7d


2. Install dependencies:
    bcrypt
    cors
    dotenv
    express
    express-validator
    jsonwebtoken
    mongoose


3. Start dev server:
npm run dev

4. Seed the database
npm run seed


**Backend**
- Node.js (Express.js)
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing

## Features

### 1. Authentication
- Register and login with email/password
- JWT-based authentication
- Password hashing with bcrypt

### 2. Projects
- Create, update, delete projects
- View only your projects
- Project fields: `title`, `description`, `status` (`active`, `completed`)

### 3. Tasks
- Tasks linked to projects
- CRUD operations on tasks
- Task fields: `title`, `description`, `status` (`todo`, `in-progress`, `done`), `dueDate`
- Filter tasks by status

### 4. Seeder Script
- Creates **1 test user**:  
  - Email: `test@example.com`  
  - Password: `Test@123`  
- Adds **2 projects** for the user
- Adds **3 tasks** per project

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/project-management-tool.git
cd project-management-tool
