# 🚀 FocusFlow | Task Management System

### Software Engineering Assessment 

[cite_start]FocusFlow is a comprehensive Task Management System built to satisfy the requirements for the **Full-Stack Track**. [cite_start]The system features a secure **Node.js/TypeScript** API [cite: 7] [cite_start]and a responsive **Next.js (App Router)** frontend.

## ✨ Features & Requirements Met

### [cite_start]🔐 1. Security & Authentication [cite: 10]
- [cite_start]**Dual-Token System:** Implements short-lived **Access Tokens** for protection and long-lived **Refresh Tokens** for persistent sessions[cite: 14, 15].
- [cite_start]**Password Hashing:** Uses **bcrypt** to securely hash credentials before database storage[cite: 16].
- [cite_start]**Protected Routes:** Middleware validates JWTs for all task-related operations[cite: 12].
- [cite_start]**Endpoints:** Fully functional `/auth/register`, `/auth/login`, `/auth/refresh`, and `/auth/logout`[cite: 17].

### [cite_start]📋 2. Task Management (CRUD) [cite: 18]
- [cite_start]**Personalized Access:** Users can only view, create, edit, or delete their own tasks[cite: 19].
- [cite_start]**Advanced Filtering:** View tasks by status (Pending/Completed) via the working sidebar[cite: 21].
- [cite_start]**Live Search:** Search tasks by title directly from the dashboard[cite: 21, 36].
- [cite_start]**Toggle Feature:** Quick status updates (Toggle) as required by the technical specification[cite: 23, 39].
- **Remarks:** Custom feature added to document blockers or notes for pending tasks.

### 💻 3. Technical Implementation
- [cite_start]**Frontend:** Built with **Next.js 15+**, TypeScript, and Tailwind CSS for a fully responsive design[cite: 29, 37].
- [cite_start]**Backend:** Node.js API using **Prisma/TypeORM** to interface with an SQL database[cite: 9, 26].
- [cite_start]**Notifications:** Integrated **Toast** notifications for successful CRUD operations and error handling[cite: 40].

## [cite_start]🛠️ Project Structure [cite: 54]

```text
├── apps/
[cite_start]│   ├── web/                # Next.js Frontend (Track A) [cite: 27]
[cite_start]│   │   ├── services/api.ts # Axios instance with interceptors for Refresh Tokens [cite: 33]
[cite_start]│   │   └── components/     # UI components & Task Forms [cite: 39]
[cite_start]│   └── api/                # Node.js Backend API [cite: 7]
[cite_start]│       ├── prisma/         # Database Schema & Migrations [cite: 26]
[cite_start]│       ├── src/auth/       # JWT Logic & Auth Endpoints [cite: 10]
[cite_start]│       └── src/tasks/      # CRUD Controllers & Service Layer [cite: 18]
🚀 Installation & Setup
Prerequisites
Node.js (v18+)

SQL Database (PostgreSQL/MySQL)

Steps
Clone the project:

Bash
git clone [https://github.com/your-repo/task-management-system.git](https://github.com/your-repo/task-management-system.git)
Setup Backend:

Navigate to /api, run npm install.

Configure your .env with DATABASE_URL and JWT_SECRET.

Run npx prisma migrate dev.

Setup Frontend:

Navigate to /web, run npm install.

Add NEXT_PUBLIC_API_URL to your .env.local.

Start Development:

Run npm run dev in both directories.

📄 Assessment Objective
The objective of this project is to demonstrate full-stack proficiency, specifically handling secure authentication workflows and complex CRUD operations within a modern software architecture.


---

### Key Technical Highlight for your Reviewer:
In the **Frontend Authentication Logic**[cite: 30], I implemented an **Axios Interceptor**. This ensures that if the **Access Token** expires (returning a 401 Unauthorized), the app automatically calls the `/auth/refresh` endpoint to get a new token without logging the user out[cite: 33, 49].

**Would you like me to help you write the `Pagination` logic for the `GET /task