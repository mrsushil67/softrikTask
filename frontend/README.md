# React + TypeScript + Vite

# 📌 Project Management Tool – Frontend

A **React (TypeScript)** frontend built with **Vite** and **Tailwind CSS** for a basic **Project Management Tool**.  
This application connects to a **Node.js + MongoDB backend** to provide user authentication, project creation, and task tracking.

---

## 🚀 Features

### **Authentication**
- JWT-based login and registration
- Secure password handling (hashed in backend)
- Auth state persisted in local storage

### **Filter and Pagination**
- Added filters in Project and Tasks by their Status 
- Add Pagination in ProJect list

### **Add Contextd Api to centralize data **
- Add Context api to storege and Cerntralize data

### **Projects**
- Create, update, delete projects
- View a list of your own projects
- Fields: `title`, `description`, `status` (`active`, `completed`)

### **Tasks**
- Create, edit, delete tasks associated with projects
- Fields: `title`, `description`, `status` (`todo`, `in-progress`, `done`), `due date`
- Filter tasks by status
- Soft delete support (deleted tasks hidden from view)

### **UI / UX**
- Modern design with **Tailwind CSS**
- Responsive layout for desktop & mobile
- Project details page with interactive task list
- Form validation with clear error messages

---

## 🛠 Tech Stack

    "@tailwindcss/vite": "^4.1.11",
    "axios": "^1.11.0",
    "lucide-react": "^0.539.0", #for icons
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.8.0",
    "tailwindcss": "^4.1.11"

- **Frontend Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Icons:** lucide-react
- **HTTP Client:** Axios
- **Backend API:** Node.js + Express.js (or NestJS) + MongoDB

---

## 📂 Folder Structure

frontend/
│── public/ # Static assets
│── src/
│ ├── components/ # Reusable UI components (Navbar, TaskForm, etc.)
│ ├── pages/ # Page components (Login, Register, Dashboard, ProjectDetails)
│ ├── services/ # API service (axios setup)
│ ├── types/ # TypeScript types & interfaces
│ ├── App.tsx # Main app component with routes
│ ├── main.tsx # Entry point
│── package.json
│── tailwind.config.js
│── tsconfig.json
│── vite.config.ts

## 1. Clone the Repository
```bash
git clone https://github.com/mrsushil67/softrikTask/tree/main/frontend
cd frontend


## 2. install Libraries

-- npm install

## 3. run frontend

npm run dev
