# Bibliotek X API

Base URL: `http://localhost:5000/api`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`
- `POST /auth/logout`

## Courses

- `GET /courses`
- `GET /courses/:id`
- `POST /courses`
- `PATCH /courses/:id`
- `POST /courses/:id/enroll`
- `GET /courses/me/enrollments`

## Content

- `GET /content/:courseId`
- `POST /content/:courseId`
- `POST /content/explain`

## Adaptive Intelligence

- `GET /analytics/student`
- `GET /analytics/admin`
- `GET /quiz/adaptive`
- `POST /quiz/adaptive/submit`
- `POST /focus/sessions`
- `POST /voice/doubt`

## Collaboration

- `GET /collaboration/rooms/:roomId/messages`
- Socket events:
  - `join-room`
  - `chat:message`
  - `notification:create`

## Example Login Payload

```json
{
  "email": "student@bibliotekx.ai",
  "password": "Password123!"
}
```

