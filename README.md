# TaskMaster - Full Stack Task Management Application

TaskMaster is a sophisticated, feature-rich task management application built with a modern tech stack. It provides a seamless experience for organizing, tracking, and managing tasks with a beautiful UI, real-time analytics, and a robust backend.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [UI/UX Overview](#uiux-overview)
- [Logic & Architecture](#logic--architecture)

## Features

### Core Functionality
- **User Authentication**: Secure registration and login using JWT.
- **Task Management**: Create, read, update, and delete tasks.
- **Task Organization**: Filter by priority, status, and date ranges.
- **Dashboard Analytics**: Real-time statistics, progress tracking, and visual charts.
- **Calendar View**: Monthly calendar with task indicators and daily views.

### User Experience
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile.
- **Dark Mode**: System-aware dark mode with manual toggle.
- **Global Search**: Instantly search across all tasks.
- **Smooth Animations**: Polished transitions and micro-interactions.

## Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4, Class Variance Authority (CVA)
- **UI Components**: Radix UI primitives, Lucide React icons
- **Visualization**: Recharts for analytics
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (using `pg` driver)
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Security**: CORS, Helmet (recommended)

## Project Structure

The project is organized into two main directories:

```
Assignment-Penthara/
├── backend/         # Node.js + Express API
│   ├── src/
│   │   ├── config/      # Database and env config
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Auth middleware
│   │   ├── routes/      # API endpoints
│   │   └── app.ts       # App setup
│   └── ...
├── frontend/        # React + Vite Client
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── services/    # API integration
│   │   └── hooks/       # Custom hooks
│   └── ...
└── README.md        # This file
```

## Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **PostgreSQL** database instance
- **npm** or **yarn**

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `env.example` to `.env`.
   - Update `DATABASE_URL` with your PostgreSQL connection string.
   - Set `JWT_SECRET` and `CORS_ORIGIN`.
4. Start the server:
   ```bash
   npm run dev
   ```
   The server runs on `http://localhost:4000` by default.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `env.example` to `.env`.
   - Ensure `VITE_API_URL` points to your backend (e.g., `http://localhost:4000/api`).
4. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## UI/UX Overview

The frontend is designed with a focus on usability and aesthetics:

- **Dashboard**: The landing page provides a high-level overview of productivity. It uses `Recharts` to display task completion trends and status distributions.
- **Task List**: Tasks are displayed in a grid or list view. The `Accordion` component groups tasks by timeframe (Today, This Week, etc.), making large lists manageable.
- **Task Form**: A modal dialog (`Radix UI Dialog`) allows for creating and editing tasks without leaving the context.
- **Calendar**: A custom calendar implementation highlights days with tasks, allowing users to plan their schedule visually.
- **Sidebar**: A collapsible sidebar ensures navigation is accessible but unobtrusive, especially on mobile devices.

## Logic & Architecture

### Frontend Logic
- **Service Layer** (`frontend/src/services`): Abstracts API calls. `taskService.ts` handles all task-related HTTP requests, automatically attaching the JWT token from `localStorage`.
- **Authentication**: The app checks for a valid token on load. If missing or expired, it redirects to the login page.
- **Custom Hooks**: Hooks like `useAuth` (hypothetical) or component-level `useEffect` hooks manage data fetching and side effects.

### Backend Logic
- **MVC Pattern**: The backend follows a Model-View-Controller structure (though "View" is JSON responses).
  - **Controllers** (`backend/src/controllers`): Handle request validation, business logic, and database interactions.
  - **Routes** (`backend/src/routes`): Define API endpoints and map them to controllers.
- **Middleware**: `authMiddleware.ts` intercepts protected routes to verify JWT tokens, ensuring only authenticated users can access their data.
- **Database Access**: Raw SQL queries via `pg` pool provide high performance and control over data interactions.
