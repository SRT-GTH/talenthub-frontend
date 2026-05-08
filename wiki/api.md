# API

## Client `✅ VERIFIED`

Single axios instance in `src/services/api.js`.

```javascript
import { api } from '../services/api';
api.get('/users/me');
api.post('/sessions', { email, password });
```

### Configuration

| Setting        | Value                                                  | Source    |
| -------------- | ------------------------------------------------------ | --------- |
| `baseURL`      | `import.meta.env.VITE_API_BASE_URL` (fallback: `/api`) | `.env`    |
| `timeout`      | 15s                                                    | hardcoded |
| `Content-Type` | `application/json`                                     | hardcoded |

### Interceptors

- **Request**: attaches `Authorization: Bearer <token>` if `STORAGE_KEYS.authToken` is in `localStorage`. Logs the outgoing call via `debug('api')`.
- **Response**: logs status + URL on success; logs `× <status> <url> <message>` on error and rejects.

### Refresh-Token Flow `❓ NEEDS-CLARIFICATION`

Not implemented yet. When auth ships, add a 401-retry interceptor that:

1. Catches a 401 response.
2. POSTs to the refresh endpoint with the refresh token from `STORAGE_KEYS.refreshToken`.
3. On success, replays the original request with the new access token.
4. On failure, clears tokens and redirects to login.

See elysium's `src/admin/providers/authProvider.js` for the reference implementation (it uses fetch, but the logic transfers).

## Endpoints `❓ NEEDS-CLARIFICATION`

No endpoints wired yet. As features land, document them here:

```
| Method | Path | Purpose | Slice |
|---|---|---|---|
| POST | /sessions | login | auth |
| GET | /users/me | current user profile | account |
```

## Environment

| Variable            | Required | Example                            |
| ------------------- | -------- | ---------------------------------- |
| `VITE_API_BASE_URL` | yes      | `https://api.talenthub.example/v1` |
| `VITE_APP_NAME`     | no       | `TalentHub`                        |

All public env vars MUST start with `VITE_` per Vite convention.
