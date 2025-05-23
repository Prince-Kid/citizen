
# Citizen Engagement System (MERN MVP)

A Minimum Viable Product (MVP) for a **Citizen Engagement System** that allows citizens to submit complaints or feedback on public services, and enables government agencies to categorize, route, track, and respond to submissions.

## 📑 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Usage](#usage)
* [API Reference](#api-reference)
* [Project Structure](#project-structure)
* [Contributing](#contributing)
* [License](#license)

## 📝 Overview

In many communities, citizen complaints are scattered across multiple channels (email, phone, social media), causing delays and loss of accountability. This MVP centralizes complaint submission and tracking, making it easy for:

* **Citizens** to submit complaints and monitor status
* **Government Agencies** to categorize, assign, and resolve tickets

## 🚀 Features

* **User Authentication**
  * Citizen registration and login
  * Role-based access (citizen, admin, department_head)
  * JWT-based authentication

* **Complaint Management**
  * Submit new complaints with details
  * Track complaint status
  * View complaint history
  * Admin dashboard for complaint management

* **Department Management**
  * Department-specific views
  * Complaint routing to appropriate departments
  * Status updates and responses

## 🛠 Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Frontend       | Next.js 14, TypeScript, Tailwind CSS|
| Backend        | Node.js, Express.js, TypeScript     |
| Database       | MongoDB Atlas                       |
| Authentication | JWT                                 |
| UI Components  | shadcn/ui                           |

## 🔧 Prerequisites

* Node.js (v18+)
* pnpm or npm
* MongoDB Atlas account
* Git

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/citizen-engagement-system.git
   cd citizen-engagement-system
   ```

2. **Install dependencies**

   * Backend:
     ```bash
     cd backend
     npm install
     ```

   * Frontend:
     ```bash
     cd ../frontend
     pnpm install
     ```

3. **Set up environment variables**

   Create `.env` in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. **Run development servers**

   * Backend:
     ```bash
     cd backend
     npm run dev
     ```

   * Frontend:
     ```bash
     cd frontend
     pnpm dev
     ```

## 🗂 Project Structure

```
citizen-engagement-system/
├── frontend/                # Next.js frontend
│   ├── app/                # App router pages
│   ├── components/         # Reusable components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── public/            # Static assets
│   └── styles/            # Global styles
│
├── backend/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Entry point
│   └── package.json
│
└── docker-compose.yml      # Docker configuration
```

## 📖 API Reference

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |

### Complaints

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| POST   | `/api/complaints`       | Submit new complaint       |
| GET    | `/api/complaints`       | List complaints            |
| GET    | `/api/complaints/:id`   | Get complaint details      |
| PATCH  | `/api/complaints/:id`   | Update complaint status    |

### Departments

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| GET    | `/api/departments`      | List departments           |
| GET    | `/api/departments/:id`  | Get department details     |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Would you like me to modify any section of this README further?
