# 🍔 BiteBlitz — Restaurant Management System

## 📋 Project Overview

**BiteBlitz** is a **full-stack restaurant management system** built to manage menus, orders, tables, reservations, and daily restaurant operations.

- **Developer:** Syed Hamza Afzaal
- **Date:** August 2026
- **Type:** Full Stack Web Application

## 🛠️ Technology Stack

### Backend
- **Django 6.1**
- **Django REST Framework**
- **JWT Authentication**
- **SQLite / PostgreSQL**

### Frontend
- **React 18**
- **React Router**
- **Axios**
- **Bootstrap 5**

## 🏗️ System Architecture

The application follows a **3-Tier Architecture**:

1. **Presentation Layer** — React frontend
2. **Application Layer** — Django REST API and business logic
3. **Data Layer** — SQLite/PostgreSQL with Django ORM

![System Architecture](System_Architecture.png)

## 📊 Database Design

### Main Entities

- **User** — Authentication and user roles
- **Staff** — Employee information
- **Category** — Food categories
- **MenuItem** — Restaurant menu items
- **Table** — Dining table management
- **Reservation** — Customer reservations
- **Order** — Customer orders
- **OrderItem** — Individual order items
- **Payment** — Payment transactions

![ERD](ERD.png)

## 📡 API

**Base URL:** `http://localhost:8000/api/`

| **Method** | **Endpoint** | **Description** |
|---|---|---|
| `POST` | `/auth/login/` | User login |
| `POST` | `/auth/refresh/` | Refresh JWT token |
| `GET` | `/categories/` | List categories |
| `GET` | `/menu-items/` | List menu items |
| `GET` | `/tables/` | List tables |
| `GET` | `/orders/` | List orders |
| `GET` | `/reservations/` | List reservations |
| `GET` | `/dashboard/summary/` | Dashboard statistics |

## 🚀 Installation & Setup

### **Backend**

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### **Frontend**
```bash
cd frontend
npm install
npm start
```

### **✅ Features**
- JWT Authentication
- Dashboard & Analytics
- Menu Management (CRUD)
- Order Management
- Table Management
- Reservation Management
- RESTful API
- Responsive UI
- Database Integration

### **🔮 Future Enhancements**
- Real-time notifications
- Inventory management
- Mobile application
- Customer loyalty program
- Online ordering system

### **👥 Contributors**
Syed Hamza Afzaal — Full Stack Engineer

Alina Baber — Project Reviewer

- Project:  BiteBlitz — Restaurant Management System - Built for Full Stack Development Internship Task 4
