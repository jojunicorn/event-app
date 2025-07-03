# EventSphere

EventSphere is a full-stack event management platform that allows users to browse, join, and organize events. It supports role-based access for admins, organizers, and regular users, and integrates MongoDB for data storage, with a React frontend and Spring Boot backend.

---

## Getting Started

To run the full application, including frontend, backend, MongoDB, and Mongo Express:

### 1. Build & Run with Docker

```bash
mvn clean package
docker compose up --build -d
```

## 2. Access the Services

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8077](http://localhost:8077)
- **Mongo Express (Database UI):** [http://localhost:8081](http://localhost:8081)  
  _(Login with `user` : `user`)_

---

## Known Issues

For some unexplainable reason, the **Notifications** module as well as some **PUT** operations do **not work** when running the **backend inside Docker**.  

If you want to test all functionality, **please run the backend locally** instead of via Docker.

## Demo Accounts

> All demo accounts use the same password: `password123`

### Admin Account
- **Email:** `admin@admin.com`
- **Password:** `password123`

### Organizer Account
- **Email:** `organizer1@test.com`
- **Password:** `password123`

### Regular User Account
- **Email:** `john@doe.com`
- **Password:** `password123`
