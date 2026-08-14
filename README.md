# Stable Ops

A full-stack stable management application built with **FastAPI**, **React**, and **PostgreSQL**. Stable Ops allows users to manage horses, employees, and daily tasks through a clean, responsive interface with secure authentication and role-based access control.

## Live Demo

**Frontend:** https://stable-ops-api.vercel.app

**Backend API:** https://stable-ops-api.onrender.com

---

## Features

- Secure JWT Authentication
- Guest Login
- Role-Based Authorization
- CRUD Operations
- Search Functionality
- Responsive Dashboard
- Confirmation Dialogs for Deletes
- Success Notifications
- PostgreSQL Database
- RESTful API
- Production Deployment

---

## Tech Stack

### Frontend

- React
- Vite
- Axios
- React Router
- CSS

### Backend

- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- Passlib (bcrypt)

### Database

- PostgreSQL
- Neon

### Deployment

- Vercel
- Render
- GitHub

---

## Project Structure

```
stable-ops-api/
│
├── app/
│   ├── routers/
│   ├── auth.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── styles/
│
└── requirements.txt
```

---

## Authentication

Users authenticate using JWT tokens.

Roles include:

- Admin
- Manager
- Employee
- Guest

Protected routes require authentication and role-based permissions.

---

## 📋 API Endpoints

### Horses

- GET /horses
- POST /horses
- PUT /horses/{id}
- DELETE /horses/{id}

### Employees

- GET /employees
- POST /employees
- PUT /employees/{id}
- DELETE /employees/{id}

### Tasks

- GET /tasks
- POST /tasks
- PUT /tasks/{id}
- DELETE /tasks/{id}

### Users

- POST /users
- POST /login

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Future Improvements

- Horse profile photos
- Calendar scheduling
- Notifications
- File uploads
- Reporting & analytics
- Mobile responsiveness improvements

---

## Author

**Veronica Foltz**

GitHub:
https://github.com/veronica-foltz
