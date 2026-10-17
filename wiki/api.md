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

### Dev proxy `✅ VERIFIED` (2026-10-16)

With `VITE_API_BASE_URL` unset, calls go to `/api` and `vite.config.js` proxies them to `VITE_PROXY_TARGET` (default: staging backend `https://srt-backend-m5mc.onrender.com`). It strips the browser `Origin` header because the backend checks `Origin` against its `CORS_ORIGINS` and proxied calls are server-to-server. Deployed builds set `VITE_API_BASE_URL` to the full backend URL (e.g. `.../api`).

### Refresh-Token Flow `❓ NEEDS-CLARIFICATION`

Still not implemented: login stores `accessToken` / `refreshToken` / `user` in `localStorage` (`STORAGE_KEYS.authToken|refreshToken|userProfile`) but nothing refreshes on 401. When added: catch 401, POST the refresh token, replay the request, on failure clear tokens and redirect to login.

## Service modules `✅ VERIFIED` (2026-10-16)

All live in `src/services/` and use the shared axios instance.

| Module                                        | Role                                                                                                                                                                                                                                                                   |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth.api.js`                                 | Two-step login: `requestLoginOtp` → `verifyLoginOtp` (stores tokens) → `resendLoginOtp`. `LOGIN_MODE` (`email` / `phone` / `both`) from `VITE_LOGIN_IDENTIFIER`. The code always goes to the account email; staging accepts `123456` while `ENABLE_TEST_OTP_BYPASS=1`. |
| `onboarding.api.js`                           | Talent onboarding, public + session based (`/v1/onboarding`). Session token lives in `sessionStorage` (`th:onboarding-session`, backend session 48 h) so a refresh can resume via the status call.                                                                     |
| `onboardingMappers.js`, `onboardingReview.js` | Map form values to backend fields; build the live review page from captured data.                                                                                                                                                                                      |
| `institution.api.js`                          | Institution registration: draft in storage, contact-email code, then register.                                                                                                                                                                                         |
| `institutionBulk.js`                          | Bulk student upload: template CSV, in-browser CSV/XLSX parse + row checks (max 10,000 rows), backend validate-only pass, submit valid rows, poll status. State in `sessionStorage` (`th:institution-bulk`). Uses `read-excel-file`.                                    |
| `apiErrors.js`                                | One map from backend error codes (`OTP_INVALID`, `SESSION_INVALID`, `EMAIL_ALREADY_REGISTERED`, …) to user-facing copy. Edit strings here, not in pages.                                                                                                               |

Backend error shape (moleculer-web): `{ name, message, code, type, data }`; field validation may arrive as `{ errors: { field: message } }`.

## Endpoints `✅ VERIFIED` (2026-10-16)

| Method | Path                                                   | Purpose                                                              | Module          |
| ------ | ------------------------------------------------------ | -------------------------------------------------------------------- | --------------- |
| POST   | `/auth/login`                                          | request login code                                                   | auth            |
| POST   | `/auth/verify-otp`                                     | verify code → tokens + user                                          | auth            |
| POST   | `/auth/resend-otp`                                     | resend login code                                                    | auth            |
| POST   | `/v1/onboarding/start`                                 | `{organizationId, dob}` → `sessionToken`, `agePath`, `currentStep`   | onboarding      |
| POST   | `/v1/onboarding/capture/:stepKey`                      | save a step (identity, contact, address, education, consent, parent) | onboarding      |
| POST   | `/v1/onboarding/upload-photo`                          | profile photo as base64 (JPG/PNG/WebP, ≤ 5 MB)                       | onboarding      |
| POST   | `/v1/onboarding/verify-contact`, `/resend-contact-otp` | contact verification code                                            | onboarding      |
| POST   | `/v1/onboarding/activate`                              | finish sign-up                                                       | onboarding      |
| GET    | `/v1/onboarding/status`                                | resume a session                                                     | onboarding      |
| POST   | `/auth/contact-verification/send`, `/verify`           | institution contact email code → `verificationToken`                 | institution     |
| POST   | `/auth/register-organization-with-contact`             | register institution                                                 | institution     |
| POST   | `/users/upload-bulk-csv-with-grouping`                 | bulk upload (`validateOnly` for the check pass)                      | institutionBulk |
| GET    | `/users/bulk-operation-status/:id`                     | upload progress / report                                             | institutionBulk |

Onboarding step order is enforced by the backend: start → identity → contact (+ verify) → address → education → adult: consent / minor: parent → activate.

**Not wired:** parent flows (branch `feat/parent-invited-flow` on origin, unmerged), recruiter dashboard, community, profile filling, Career Buddy, Skills Lab, messages — all still static/mock data.

## Environment

| Variable                | Required  | Purpose                                                                                     |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`     | prod only | Full backend URL incl. `/api`; unset in dev (proxy).                                        |
| `VITE_PROXY_TARGET`     | no        | Dev proxy target (default staging backend).                                                 |
| `VITE_TENANT_ORG_ID`    | yes       | Platform tenant the talent signs up under (staging: Ghana Talent Hub).                      |
| `VITE_LOGIN_IDENTIFIER` | no        | `email`, `phone` or `both` (default); the backend enforces its own `LOGIN_IDENTIFIER_MODE`. |
| `VITE_APP_NAME`         | no        | `TalentHub`                                                                                 |

All public env vars MUST start with `VITE_` per Vite convention. Copy `.env.example` to `.env`.

## Tests against the API

`tests/e2e/{login,onboarding-adult,onboarding-minor,institution-register,institution-bulk}.spec.js` (helpers in `tests/e2e/helpers/`) run against the live staging backend, so they depend on staging being up. Use `npm run test:e2e:headed` to watch them.
