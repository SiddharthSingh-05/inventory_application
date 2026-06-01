# StockFlow — Inventory & Order Management System

A full-stack inventory management system built with React, FastAPI, PostgreSQL, and Docker.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Axios |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | PostgreSQL 15 |
| Containerization | Docker, Docker Compose |

## Features

- **Product Management** — Add, edit, delete products with SKU, price, and stock
- **Customer Management** — Register and manage customers
- **Order Management** — Place orders with automatic stock deduction and total calculation
- **Dashboard** — Summary stats + low-stock alerts
- **Business Logic** — Unique SKU/email validation, stock checks, auto total calculation

---

## Run Locally with Docker

### Prerequisites
- Docker Desktop installed and running
- Git

### Steps

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd inventory-app

# 2. Copy and configure environment
cp .env.example .env
# Edit .env if needed (default values work for local)

# 3. Start everything
docker compose up --build

# 4. Open the app
# Frontend: http://localhost:3000
# Backend API docs: http://localhost:8000/docs
```

To stop: `docker compose down`  
To wipe data too: `docker compose down -v`

---

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /products | List all products |
| POST | /products | Create product |
| GET | /products/{id} | Get product |
| PUT | /products/{id} | Update product |
| DELETE | /products/{id} | Delete product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /customers | List all customers |
| POST | /customers | Create customer |
| GET | /customers/{id} | Get customer |
| DELETE | /customers/{id} | Delete customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /orders | List all orders |
| POST | /orders | Create order |
| GET | /orders/{id} | Get order details |
| DELETE | /orders/{id} | Cancel order |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /dashboard | Get summary stats |

Full interactive docs at `/docs` (Swagger UI).

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Set root directory: `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `DATABASE_URL` (from Render PostgreSQL)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com), import repo
2. Set root directory: `frontend`
3. Add environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com`
4. Deploy

---

## Project Structure

```
inventory-app/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── database.py      # DB connection
│   │   ├── config.py        # Settings
│   │   └── routers/
│   │       ├── products.py
│   │       ├── customers.py
│   │       ├── orders.py
│   │       └── dashboard.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── api/index.js
│   │   ├── components/Sidebar.js
│   │   └── pages/
│   │       ├── Dashboard.js
│   │       ├── Products.js
│   │       ├── Customers.js
│   │       └── Orders.js
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── .env.example
```
