# Bibliotek X

Bibliotek X is a production-oriented MERN Learning Operating System built for modern learning workflows, recruiter demos, and extensible AI experimentation. It combines authentication, course delivery, adaptive learning, collaboration, analytics, and AI-powered content intelligence in one modular platform.

## Live App 
Link : https://bibliotek-x-client-rdltq0apc-anshdwis-projects.vercel.app/login

## Stack

- MongoDB + Mongoose
- Express + Node.js
- React + Vite
- Tailwind CSS
- Socket.io
- OpenAI-ready AI service adapters

## Monorepo Structure

```text
Bibliotek X/
  client/        React frontend
  server/        Express API + sockets + seeders
  docs/          API docs
  sample-data/   Demo JSON payloads
```

## Key Features

- JWT auth with refresh tokens
- Role-based access control for admin, teacher, student
- Course creation, enrollment, and content management
- Knowledge graph visualization for topic dependencies
- Adaptive quiz engine with difficulty progression
- Learning digital twin with mastery, weak area, and dropout-risk insights
- Focus mode analytics with tab-switch and inactivity capture
- Realtime chat and notifications with Socket.io
- AI summarization, flashcards, explain-this, and voice doubt helpers
- Gamification, leaderboard, analytics, and audit logging

## Setup

1. Copy [`server/.env.example`](./server/.env.example) to `server/.env`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend:
   ```bash
   npm run dev:server
   ```
4. Start the frontend:
   ```bash
   npm run dev:client
   ```
5. Seed demo data:
   ```bash
   npm run seed
   ```

## Deployment

Deployment guidance is available in [`docs/deployment.md`](./docs/deployment.md).

