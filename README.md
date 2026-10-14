# MERN Task Manager

Task manager with JWT authentication. React (Vite) and Tailwind CSS on the client, Express and MongoDB (Mongoose) on the server. Light mode only.

## Setup

Requirements: Node.js 18+ and a running MongoDB instance (local or Atlas).

### Server

    cd server
    cp .env.example .env      # set MONGO_URI and JWT_SECRET
    npm install
    npm run dev               # http://localhost:5000

### Client

    cd client
    cp .env.example .env      # optional, defaults to http://localhost:5000/api
    npm install
    npm run dev               # http://localhost:5173

## API

All task routes require the header `Authorization: Bearer <token>`.

| Method | Route                | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | /api/auth/register   | Create account, returns JWT  |
| POST   | /api/auth/login      | Sign in, returns JWT         |
| GET    | /api/auth/me         | Current user                 |
| GET    | /api/tasks           | List the user's tasks        |
| POST   | /api/tasks           | Create a task                |
| PUT    | /api/tasks/:id       | Update a task                |
| DELETE | /api/tasks/:id       | Delete a task                |

Task fields: `title` (required), `description`, `status` (todo, in-progress, done), `priority` (low, medium, high), `dueDate`.

## Structure

    server/
      server.js            app setup, error handler, DB connection
      models/              User, Task
      middleware/auth.js   JWT verification
      routes/              auth, tasks
    client/src/
      api.js               fetch wrapper with token handling
      AuthContext.jsx      session state
      pages/               AuthPage, Dashboard
      components/          TaskForm, TaskItem
