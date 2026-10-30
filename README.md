# Qelvo — Real-Time Messaging Platform

Qelvo is a full-stack, real-time messaging application for one-to-one conversations. Users can create an account, manage their profile, discover other registered users, and exchange text messages and images in real time.

## Features

- User registration, login, and logout
- JWT authentication stored in HTTP-only cookies
- One-to-one messaging with persistent chat history
- Real-time message delivery with Socket.IO
- Online-user presence
- Profile picture updates
- Image sharing through Cloudinary
- Global client state with Zustand
- Responsive React interface

## Tech Stack

**Frontend:** React, Vite, React Router, Zustand, Axios, Tailwind CSS, DaisyUI, Socket.IO Client, Lucide React, React Hot Toast.

**Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO, JSON Web Tokens, bcryptjs, Cloudinary, cookie-parser, and CORS.

## Project Structure

```text
Qelvo/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── lib/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── index.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── store/
│       ├── lib/
│       └── ui/
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB database
- Cloudinary account for image uploads

### 1. Clone the repository

```bash
git clone https://github.com/kshitij12375/Qelvo.git
cd Qelvo
```

### 2. Run the backend

```bash
cd backend
npm install
```

Create `backend/.env` using `backend/.env.example` as a template. Fill in your own credentials, then run:

```bash
npm run dev
```

The backend uses port `5000` by default.

### 3. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Environment Variables

### Backend (`backend/.env`)

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `NODE_ENV` | Runtime environment |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET` | Cloudinary API secret |
| `CLIENT_URL` | Exact frontend origin allowed by CORS |

### Frontend (optional)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL, including `/api` (for example, `https://your-api.example.com/api`) |
| `VITE_SOCKET_URL` | Backend origin used by Socket.IO (for example, `https://your-api.example.com`) |

Keep real credentials in environment variables. Never commit `.env` files or API secrets.

## API Routes

All REST endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/signup` | Create an account | Public |
| POST | `/auth/login` | Log in | Public |
| POST | `/auth/logout` | Log out | Public |
| GET | `/auth/check` | Check the current session | Protected |
| PUT | `/auth/updateProfile` | Update profile picture | Protected |

### Messages

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/message/users` | Get users for the chat sidebar | Protected |
| GET | `/message/:id` | Get conversation history with a user | Protected |
| POST | `/message/send/:id` | Send a message to a user | Protected |

Protected routes require a valid authentication cookie.

## How It Works

1. Express handles authentication and REST API requests.
2. Passwords are hashed with bcryptjs before storage.
3. JWT cookies authenticate protected API requests and Socket.IO connections.
4. MongoDB stores user information and chat messages.
5. Socket.IO delivers new messages and online-presence updates.
6. Cloudinary stores uploaded profile and chat images.
7. Zustand manages authentication and chat state in the React client.

## Deployment Notes

The backend can serve the built frontend from `frontend/dist` when deployed as a combined application. If the frontend and backend are separate services, set `VITE_API_URL`, `VITE_SOCKET_URL`, and `CLIENT_URL` to the correct deployed origins. Cross-site cookie authentication requires HTTPS, `SameSite=None`, `Secure`, and credentialed CORS.

For production, use a strong unique JWT secret, restrict CORS to your frontend origin, and configure your MongoDB and Cloudinary credentials in the hosting provider. The in-memory online-user map is intended for a single backend instance; multiple instances need a shared Socket.IO adapter.

## Project Scope

Qelvo focuses on one-to-one conversations, authentication, profile management, image sharing, persistent messages, and online presence. It does not claim end-to-end encrypted messaging.

---

Built with React, Node.js, MongoDB, and Socket.IO.
