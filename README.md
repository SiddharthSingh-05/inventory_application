# StockFlow — Inventory & Order Management System

> A production-ready, full-stack inventory management system built with **React 18**, **FastAPI**, **PostgreSQL 15**, and **Docker** — designed for real-world operational workflows.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Design Decisions](#design-decisions)

---

## Overview

StockFlow is a full-stack business application that streamlines inventory tracking, customer management, and order fulfillment. It enforces data integrity at both the API and database layers — preventing overselling, enforcing unique constraints, and computing order totals automatically.

The system is fully containerized with Docker Compose, making it reproducible across any environment with a single command.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18, React Router v6, Axios | SPA with client-side routing |
| Backend | Python 3.11, FastAPI, SQLAlchemy | RESTful API with async support |
| Database | PostgreSQL 15 | Relational data with ACID guarantees |
| Containerization | Docker, Docker Compose | Reproducible local and production environments |
| Frontend Server | Nginx | Static file serving and reverse proxy |

---

## Features

### Product Management
- Create, update, and delete products with SKU, name, price, and stock quantity
- SKU uniqueness enforced at the database level

### Customer Management
- Register customers with contact details
- Email uniqueness validation to prevent duplicate accounts

### Order Management
- Place orders referencing any registered customer and product
- Automatic stock deduction on order creation
- Real-time stock availability check — orders with insufficient stock are rejected
- Order total calculated server-side (unit price × quantity)
- Order cancellation with stock restoration

### Dashboard
- Aggregated summary: total products, customers, orders, and revenue
- Low-stock alerts for products falling below threshold

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker Network                        │
│                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌─────────────┐  │
│  │   React SPA  │────▶│  FastAPI     │────▶│ PostgreSQL  │  │
│  │  (Nginx:80)  │     │  (:8000)     │     │   (:5432)   │  │
│  └──────────────┘     └──────────────┘     └─────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

The frontend communicates with the backend exclusively through a versioned REST API. The backend manages all business logic and persists state to PostgreSQL via SQLAlchemy ORM. All three services are orchestrated via Docker Compose with a shared internal network and a named volume for PostgreSQL data persistence.

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git

### Local Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd inventory-app

# 2. Configure environment variables
cp .env.example .env
# Default values in .env work for local development — no changes required

# 3. Build and start all services
docker compose up --build

# 4. Access the application
#    Frontend:        http://localhost:3000
#    API (Swagger):   http://localhost:8000/docs
#    API (ReDoc):     http://localhost:8000/redoc
```

### Stopping the Application

```bash
# Stop containers, preserve database data
docker compose down

# Stop containers and remove all volumes (full reset)
docker compose down -v
```

---

## API Reference

All endpoints return JSON. Error responses include a `detail` field describing the issue.

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | List all products |
| `POST` | `/products` | Create a new product |
| `GET` | `/products/{id}` | Retrieve a product by ID |
| `PUT` | `/products/{id}` | Update a product |
| `DELETE` | `/products/{id}` | Delete a product |

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/customers` | List all customers |
| `POST` | `/customers` | Register a new customer |
| `GET` | `/customers/{id}` | Retrieve a customer by ID |
| `DELETE` | `/customers/{id}` | Remove a customer |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/orders` | List all orders |
| `POST` | `/orders` | Place a new order |
| `GET` | `/orders/{id}` | Retrieve order details |
| `DELETE` | `/orders/{id}` | Cancel an order (restores stock) |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard` | Retrieve aggregated summary stats |

Interactive API documentation is available at `/docs` (Swagger UI) and `/redoc` (ReDoc) when the backend is running.

---

## Project Structure

```
inventory-app/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app entry point, router registration
│   │   ├── models.py          # SQLAlchemy ORM models
│   │   ├── schemas.py         # Pydantic request/response schemas
│   │   ├── database.py        # Database session and connection setup
│   │   ├── config.py          # Environment-based settings (via pydantic-settings)
│   │   └── routers/
│   │       ├── products.py    # Product CRUD endpoints
│   │       ├── customers.py   # Customer CRUD endpoints
│   │       ├── orders.py      # Order management endpoints
│   │       └── dashboard.py   # Aggregated stats endpoint
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.js             # Root component, route definitions
│   │   ├── api/
│   │   │   └── index.js       # Axios instance and API call helpers
│   │   ├── components/
│   │   │   └── Sidebar.js     # Navigation sidebar component
│   │   └── pages/
│   │       ├── Dashboard.js   # Summary stats and low-stock alerts
│   │       ├── Products.js    # Product listing and management UI
│   │       ├── Customers.js   # Customer listing and management UI
│   │       └── Orders.js      # Order placement and history UI
│   ├── Dockerfile
│   └── nginx.conf             # Nginx config for SPA routing
│
├── docker-compose.yml         # Multi-service orchestration
└── .env.example               # Environment variable template
```

---

## Deployment

### Backend → Render

1. Push the repository to GitHub
2. On [render.com](https://render.com), create a new **Web Service**
3. Configure the service:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Provision a **PostgreSQL** database on Render
5. Add the environment variable: `DATABASE_URL` → *(value from your Render PostgreSQL instance)*

### Frontend → Vercel

1. Import the repository on [vercel.com](https://vercel.com)
2. Configure the project:
   - **Root Directory:** `frontend`
3. Add the environment variable:
   - `REACT_APP_API_URL` → `https://your-backend.onrender.com`
4. Deploy

---

## Design Decisions

**Why FastAPI?**
FastAPI provides automatic OpenAPI documentation, native async support, and Pydantic-based validation — reducing boilerplate while maintaining strict type safety at the API boundary.

**Why PostgreSQL over SQLite?**
SQLite is unsuitable for concurrent writes (e.g., simultaneous order placements). PostgreSQL provides row-level locking, proper transaction isolation, and production-grade reliability.

**Why Docker Compose for local development?**
Eliminates environment drift between developers. Any contributor can reproduce the full stack — database included — with a single command, regardless of their local Python or Node.js version.

**Stock integrity**
Stock deduction on order creation and restoration on cancellation are handled within the same database transaction, ensuring no partial updates occur in the event of a failure mid-request.

---

