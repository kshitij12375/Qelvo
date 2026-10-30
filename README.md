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

**Frontend**
- React 19 and Vite
- React Router
- Zustand
- Axios
- Tailwind CSS and DaisyUI
- Socket.IO Client
- Lucide React
- React Hot Toast

**Backend**
- Node.js and Express 5
- MongoDB and Mongoose
- Socket.IO
- JSON Web Tokens
- bcryptjs
- Cloudinary
- cookie-parser and CORS

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
- A MongoDB database
- A Cloudinary account for image uploads

### 1. Clone the repository

```bash
git clone https://github.com/kshitij12375/Qelvo.git
cd Qelvo
```

### 2. Configure and run the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

Start the backend development server:

```bash
npm run dev
```

The backend is configured to listen on port `5000` when that value is supplied in the environment.

### 3. Configure and run the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in your terminal (normally `http://localhost:5173`).

## API Routes

All routes are prefixed with `/api`.

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

## Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `NODE_ENV` | Runtime environment |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET` | Cloudinary API secret |

Keep real credentials in environment variables. Never commit `.env` files, API keys, database passwords, or JWT secrets.

## How It Works

1. Express handles authentication and REST API requests.
2. Passwords are hashed with bcryptjs before being stored.
3. JWT cookies are used to authenticate protected API requests.
4. MongoDB stores user information and chat messages.
5. Socket.IO delivers new messages and online-presence updates.
6. Cloudinary stores uploaded profile and chat images.
7. Zustand manages authentication and chat state in the React client.

## Deployment Notes

The backend contains production-mode logic to serve a built frontend from `frontend/dist`. If deploying the frontend and backend as separate services, configure the frontend API and Socket.IO URLs, backend CORS origins, and cookie settings for the actual deployment domains. Cross-site cookie authentication requires compatible `SameSite` and `Secure` settings and credentialed CORS.

For a production deployment:

- Set all backend environment variables in the hosting provider.
- Use a strong, unique JWT secret.
- Restrict CORS to the deployed frontend origin.
- Ensure the frontend API and Socket.IO clients point to the deployed backend.
- Build the frontend with `npm run build`.
- Do not rely on in-memory online-user state across multiple backend instances without a shared Socket.IO adapter.

## Project Scope

Qelvo currently focuses on one-to-one conversations, account authentication, profile management, image sharing, message persistence, and online presence. It does not currently claim end-to-end encrypted messaging.

---

Built with React, Node.js, MongoDB, and Socket.IO.
