# Deployment

## Recommended Setup

1. Deploy MongoDB using Atlas or a managed cluster.
2. Deploy the Express API on Render, Railway, Fly.io, or a container platform.
3. Deploy the React client on Vercel or Netlify.
4. Add environment variables from [`server/.env.example`](../server/.env.example).
5. Set `CLIENT_URL` to the deployed frontend origin.
6. Use HTTPS and secure cookies in production.

## Backend Build

```bash
npm install
npm run seed --workspace server
npm run start --workspace server
```

## Frontend Build

```bash
npm install
npm run build --workspace client
```

## Hardening Checklist

- Rotate JWT secrets
- Move uploaded files to object storage
- Add request validation schemas
- Add background jobs for heavy AI/PDF/video processing
- Use Redis for Socket.io scaling and token/session revocation
- Add CI, tests, and observability before production rollout

