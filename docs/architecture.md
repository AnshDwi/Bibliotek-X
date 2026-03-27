# Architecture

## Backend

- `src/config`: environment and database configuration
- `src/models`: Mongoose schemas for auth, courses, analytics, collaboration, and auditing
- `src/services`: business logic split by domain
- `src/controllers`: request handlers
- `src/routes`: REST API routing
- `src/middleware`: auth, upload, error, and audit middleware
- `src/socket`: Socket.io gateway
- `src/seed`: sample recruiter-demo data

## Frontend

- `src/app`: router and shell
- `src/components`: reusable UI modules
- `src/pages`: role-specific dashboards and auth pages
- `src/contexts`: auth state
- `src/api`: API client
- `src/data`: mock fallback demo data

## Production Notes

- JWT access + refresh token flow
- RBAC for `admin`, `teacher`, `student`
- Upload validation with MIME allowlist and size caps
- Audit log persistence for protected actions
- AI services degrade gracefully when `OPENAI_API_KEY` is absent
- Socket layer prepared for realtime chat and notifications

