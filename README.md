# ALKFET – Fullstack Task & Project Management System

This repository contains a full-stack application designed for managing projects and tasks.

---

## Architecture

The system consists of multiple components:

- **Frontend** – Vue 3 + Vite
- **Backend** – NestJS + Prisma
- **API Gateway** – Hono (gateway layer)
- **MCP Server** – Node.js
- **Database** – Prisma ORM (MySQL)
- **Infrastructure** – Docker + Kubernetes (Helm charts)

Frontend → API Gateway → Backend → Database

---

## Project Structure

apps/
  frontend/       → Vue 3 UI
  backend/        → NestJS API
  apigateway/     → Gateway layer
  mcpserver/      → MCP Server

infrastructure/
  charts/         → Kubernetes Helm charts

docker-compose.yml → Local development setup

---

## Getting Started (Local Development)

### 1. Requirements

- Node.js (18+) -> https://nodejs.org/en/download
- Docker + Docker Compose -> https://www.docker.com/get-started/ and https://docs.docker.com/compose/install/ 

---

### 2. Run the Project

```bash
docker-compose up --build
```

This will start:
- frontend
- backend
- gateway
- mcp server

---

### 3. Access the Frontend

http://localhost:3000

---

## ⚙️ Backend

### Tech Stack

- NestJS
- Prisma ORM

### Main Modules

- projects
- tasks

### Example Endpoints

GET    /projects  
POST   /projects  
GET    /tasks  
POST   /tasks  

---

## 🗄️ Database (Prisma)

Schema location:

apps/backend/prisma/schema.prisma

Run migrations:

```bash
npx prisma migrate dev
```

---

## Frontend

### Tech Stack

- Vue 3
- Vite
- Vuetify

### Main Features

- Project listing
- Project creation
- Task management
- Project detail view

---

## API Gateway

Responsibilities:
- request routing
- connecting services

---

## Docker

Local development:

```bash
docker-compose up --build
```

Production configuration:

docker-compose.prod.yml

---

## Kubernetes (Helm)

Helm charts:

infrastructure/charts/

Services:
- frontend
- backend
- apigateway
- mcpserver

Example deployment:

```bash
helm install app infrastructure/charts/app
```

---

## Testing

Backend:

```bash
npm run test
npm run test:e2e
```

---

## Environment

Backend `.env.example`:

apps/backend/.env.example

---

## Development Notes

- Monorepo structure
- Service-oriented architecture
- Docker-first setup
- Kubernetes-ready deployment

---

## Authors

Kiss Dániel (XG8HQN), Fenyő Richárd (G415ID), Simon Zsolt (EOBYIA), Érdi Balázs (GJ0GFQ)
