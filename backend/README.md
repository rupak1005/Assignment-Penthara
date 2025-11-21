# Backend API

This is the backend service for the Task Management Application. It provides a RESTful API for user authentication and task management.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Tasks](#tasks)
- [Folder Structure](#folder-structure)

## Features
- **User Authentication**: Register, Login, and Get Current User (JWT-based).
- **Task Management**: Create, Read, Update, Delete, and Toggle Completion status of tasks.
- **Data Persistence**: PostgreSQL database for storing users and tasks.
- **Security**: Password hashing with bcrypt, JWT for session management, and CORS configuration.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **ORM/Query Builder**: `pg` (node-postgres)

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

## Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root of the `backend` directory based on `env.example`.

```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_super_secret_key
CORS_ORIGIN=http://localhost:5173
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the server listens on | `4000` |
| `DATABASE_URL` | Connection string for PostgreSQL | - |
| `JWT_SECRET` | Secret key for signing JWTs | `development-secret` |
| `CORS_ORIGIN` | Allowed origin for CORS | `http://localhost:5173` |

## Running the Application

### Development Mode
Runs the server with hot-reloading using `nodemon` (or `ts-node-dev`).

```bash
npm run dev
```

### Production Build
Builds the TypeScript code to JavaScript and runs it.

```bash
npm run build
npm start
```

## API Documentation

### Authentication

#### Register User
- **Endpoint**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `201 Created` with user details and token.

#### Login User
- **Endpoint**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK` with user details and token.

#### Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with user details.

### Tasks
All task endpoints require `Authorization: Bearer <token>` header.

#### Get All Tasks
- **Endpoint**: `GET /api/tasks`
- **Response**: `200 OK` - Array of tasks.

#### Create Task
- **Endpoint**: `POST /api/tasks`
- **Body**:
  ```json
  {
    "title": "Buy groceries",
    "description": "Milk, Bread, Eggs",
    "dueDate": "2023-12-31",
    "priority": "high"
  }
  ```
- **Response**: `201 Created` with created task.

#### Update Task
- **Endpoint**: `PUT /api/tasks/:id`
- **Body**: (All fields optional)
  ```json
  {
    "title": "Buy groceries and snacks",
    "completed": true
  }
  ```
- **Response**: `200 OK` with updated task.

#### Toggle Task Completion
- **Endpoint**: `PATCH /api/tasks/:id/toggle`
- **Response**: `200 OK` with updated task.

#### Delete Task
- **Endpoint**: `DELETE /api/tasks/:id`
- **Response**: `204 No Content`.

## Folder Structure

```
src/
├── config/         # Configuration files (Database, Env)
├── controllers/    # Request handlers (Logic layer)
├── middleware/     # Express middlewares (Auth, etc.)
├── routes/         # API route definitions
├── types/          # TypeScript type definitions
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```
