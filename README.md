# 💬 ChatServer - Real-Time Chat Application (Backend)

![Node.js](https://img.shields.io/badge/Node.js-14.x%2B-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-5.x%2B-green)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-yellow)
![JWT](https://img.shields.io/badge/JWT-Auth-orange)

A robust backend server for a real-time chat application with user authentication, contact management, and instant messaging capabilities.

## 🚀 Features

- 🔐 **JWT Authentication**
  - Secure user signup/login
  - Password hashing with bcrypt
- 👥 **User Management**
  - Profile picture uploads
  - Contact listing
- 💌 **Real-Time Messaging**
  - Instant message delivery via Socket.io
  - Message history storage
- 🛡️ **Security**
  - Input validation
  - Error handling middleware
  - CORS protection

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) | JavaScript runtime |
| ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white) | Web framework |
| ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white) | NoSQL database |
| ![Socket.io](https://img.shields.io/badge/-Socket.io-010101?logo=socket.io&logoColor=white) | Real-time communication |
| ![JWT](https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white) | Authentication tokens |

## 📚 API Documentation

### Authentication Routes
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/signup` | POST | Register new user |
| `/auth/login` | POST | User login |

### Chat Routes
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/chat/urContact` | GET | Get user contacts |
| `/chat/send` | POST | Send message |
| `/chat/renderChat/:receiver_id` | GET | Get chat history |

## 📂 Project Structure

```
chatserver/
├── controllers/        # Business logic
│   ├── authController.js
│   └── chatController.js
├── routes/             # API endpoints
│   ├── authRoutes.js
│   └── chatRoutes.js
├── model/              # Database models
├── middleware/         # Custom middleware
├── utils/              # Utility functions
├── app.js              # Main application
└── package.json
```

## 🌐 Real-Time Events

- `send` - Emitted when a new message is sent
- `connection` - When a user connects via Socket.io
- `disconnect` - When a user disconnects

## Project Demo 
[here](https://www.linkedin.com/feed/update/urn:li:activity:7272319571775115264/)
