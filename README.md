
# 🧠 AI Drawboard Backend

[Here is the frontend repo](https://github.com/Master-Faraz/Ai-Drawboard-Frontend)

![Node.js](https://img.shields.io/badge/node.js-18.x-green)

This is the backend service for the **AI Drawboard** application, which enables features like user authentication and image analysis using **Google Generative AI**. Built with **Node.js**, **Express**, and **MongoDB**, it follows a modular and scalable architecture.

---

## 🚀 Key Features

- 🔐 **User Authentication** — Secure login, registration, logout, and token refreshing via JWT.
- 🖼️ **Image Analysis** — Integrates Google Generative AI for image-based insights.
- 🛡️ **Secure APIs** — Includes authentication middleware and centralized error handling.
- 💾 **Database Integration** — Stores user data using MongoDB.
- 🧱 **Modular Architecture** — Clean and maintainable codebase for scalability.

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory. Use `.env.example` as a reference:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_api_key
```

### 4. Start the Development Server

```bash
npm run dev
```

---

## 📡 API Endpoints

### 👤 User Authentication

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | `/api/users/register`       | Register a new user      |
| POST   | `/api/users/login`          | Login with credentials   |
| POST   | `/api/users/refresh-token`  | Refresh access token     |
| POST   | `/api/users/logout`         | Logout a user            |
| GET    | `/api/users/getuser`        | Fetch user details (auth)|

### 🔍 Image Analysis

| Method | Endpoint         | Description                  |
|--------|------------------|------------------------------|
| POST   | `/api/analyze`   | Analyze image (auth required)|

---

## 🧪 Example Request

### Login

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "...",
  "user": {
    "id": "...",
    "email": "user@example.com"
  }
}
```

---

## 🧰 Tech Stack

- **Framework**: Express.js  
- **Database**: MongoDB  
- **Authentication**: JWT (JSON Web Tokens)  
- **AI Integration**: Google Generative AI  
- **Utilities**: `bcryptjs`, `cookie-parser`, `dotenv`

---

## ❗ Error Handling

Includes custom `ApiError` and `AsyncHandler` utilities to deliver consistent and descriptive error responses across all routes.

---

## 🧪 Running Tests

```bash
npm test
```

---

## 🚀 Deployment Options

This project can be easily deployed to:

- [Render](https://render.com/)
- [Railway](https://railway.app/)
- [Heroku](https://heroku.com/)
- Or your own VPS

---

## 🤝 Contributing

We welcome contributions!  
Feel free to fork this repository and submit a pull request for any feature enhancements or bug fixes.
