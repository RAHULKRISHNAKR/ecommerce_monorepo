````md
# 🛒 Ecommerce Monorepo (Microservices App)

This is a simple microservices-based ecommerce system using a **monorepo** structure.  
Each service is containerized with Docker and runs together via Docker Compose.  
CI is set up using **GitHub Actions** for each service.

---

## 📦 Services

| Service  | Folder            | Port   | Description                |
|----------|-------------------|--------|----------------------------|
| Auth     | `services/auth`    | 3001   | Handles login/authentication |
| Cart     | `services/cart`    | 3002   | Manages user cart actions   |
| Product  | `services/product` | 3003   | Lists product data          |

---

## 🚀 Getting Started

### 🔧 Requirements

- Docker & Docker Compose
- Node.js (if running locally)

### ▶️ Run All Services

```bash
docker-compose up --build
````

Visit services:

* Auth → `http://localhost:3001`
* Cart → `http://localhost:3002`
* Product → `http://localhost:3003`

---

## 🔄 CI with GitHub Actions

Each service has its own CI workflow.
On any push to a service folder, GitHub Actions installs dependencies and runs basic checks.

---

## 🛠 Folder Structure

```
ecommerce-monorepo/
├── services/
│   ├── auth/
│   ├── cart/
│   └── product/
├── .github/
│   └── workflows/
└── docker-compose.yml
```

---

## 🧠 Features

* ✅ Monorepo structure
* 🐳 Dockerized services
* ⚙️ GitHub Actions CI
* 📝 PR & Issue templates
* 📋 GitHub Project board

---
