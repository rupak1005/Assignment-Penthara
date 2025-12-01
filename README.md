
# TaskMaster - Full Stack Task Management Application

TaskMaster is a task management dashboard built to demonstrate modern React patterns (React 19), strict architectural separation, and type safety.

> **Note regarding Assignment Scope:**
> While the assignment suggested a `localStorage` implementation, I built a **Node.js/Express backend with PostgreSQL** to demonstrate end-to-end type safety, secure JWT authentication, and real-world data handling. However, the frontend remains loosely coupled and strictly follows the requested component/service structure.

## 🎥 Preview

https://github.com/user-attachments/assets/b89ad6f2-6398-490d-9084-69ee2a83d0f4



---

## ✅ Assignment Requirement Checklist

I have ensured strict adherence to the assignment guidelines:

- **File Structure:**
  - `src/components/` (PascalCase UI components)
  - `src/pages/` (Page-level views)
  - `src/services/` (API/Data logic separated from UI)
  - `src/utils/` (Helper functions)
- **Naming Conventions:** PascalCase for components, camelCase for functions/variables.
- **Documentation:** JSDoc standard used for complex logic and service functions.
- **No AI:** All logic was implemented manually without reliance on LLM generation tools.

---

## 🚀 Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS 4 + Class Variance Authority (CVA)
- **UI Components:** Radix UI Primitives, Lucide React
- **Visualization:** Recharts (for dashboard analytics)

### Backend
- **Runtime:** Node.js + Express.js
- **Database:** PostgreSQL
- **Auth:** JWT (JSON Web Tokens) + bcryptjs

---

## 📂 Project Structure

```bash
Assignment-Penthara/
├── backend/                 # Express API
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth middleware
│   │   └── routes/          # API Endpoints
├── frontend/                # React Client
│   ├── src/
│   │   ├── components/      # Reusable UI (e.g., TaskForm.tsx)
│   │   ├── pages/           # Views (e.g., Dashboard.tsx)
│   │   ├── services/        # API integration (e.g., task-service.ts)
│   │   └── utils/           # Helpers (e.g., date-formatter.ts)
└── README.md
````

-----

## 🛠️ Getting Started

### Prerequisites

  - Node.js (v18+)
  - PostgreSQL

### 1\. Backend Setup

```bash
cd backend
npm install

# Rename .env.example to .env and configure your DB string
# DATABASE_URL=postgresql://user:password@localhost:5432/taskdb

npm run dev
# Server runs on http://localhost:4000
```

### 2\. Frontend Setup

```bash
cd frontend
npm install

# Rename .env.example to .env
# VITE_API_URL=http://localhost:4000/api

npm run dev
# Client runs on http://localhost:5173
```

-----

## 🌟 Key Features

### 1\. Task Management (CRUD)

  - Create, Read, Update, and Delete tasks.
  - **Status Filtering:** Filter tasks by 'All', 'Pending', or 'Completed'.
  - **Validation:** Form validation prevents empty submissions.

### 2\. Dashboard & Analytics

  - Visual breakdown of task status using Recharts.
  - Recent activity logs.

### 3\. Custom Calendar View

  - A visual calendar interface to view task distribution across the month.

### 4\. Responsive UI/UX

  - Fully responsive layout using Tailwind CSS.
  - Dark/Light mode support.
  - Smooth transitions and accessible modals using Radix UI.

<!-- end list -->
