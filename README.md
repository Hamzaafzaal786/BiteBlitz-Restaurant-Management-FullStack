# 🍔 BiteBlitz - Restaurant Management System (FullStack)

## 📋 Overview
BiteBlitz is a full-stack restaurant management system built with **Django REST Framework** (backend) and **React** (frontend). It streamlines restaurant operations including order management, menu management, table tracking, reservations, and payment processing.

## 🚀 Features
- 🔐 User Authentication (JWT)
- 📝 Menu & Category Management (CRUD)
- 🪑 Table Management with status tracking
- 📅 Reservation System
- 🧾 Order Processing with status updates
- 💳 Payment Processing
- 📊 Dashboard with real-time analytics
- 👥 Staff Management
- 📈 Sales Reports

## 🛠️ Tech Stack

### Backend
- Django 4.x
- Django REST Framework
- JWT Authentication
- SQLite (Development)

### Frontend
- React 18.x
- Axios
- React Router DOM
- Bootstrap

## 📊 Database Schema
*(ERD will be added here)*

## 🏗️ System Architecture
*(Architecture diagram will be added here)*

## 🔧 Installation

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver