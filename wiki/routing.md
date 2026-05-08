# Routing

## Pattern `✅ VERIFIED`

Config-based routing in `src/App.jsx` using React Router v6 `<BrowserRouter>` + `<Routes>`. Mirrors elysium — not file-based, no Next.js conventions.

## Current Route Map `✅ VERIFIED`

| Path | Element    | Layout       |
| ---- | ---------- | ------------ |
| `/`  | `HomePage` | `MainLayout` |

## Reserved `❓ NEEDS-CLARIFICATION`

| Path       | Plan                                                                                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/admin/*` | Lazy-loaded admin subsystem when product needs admin features. Pattern: `const AdminApp = lazy(() => import('./admin/AdminApp'))` wrapped in `<Suspense fallback={...}>`. See elysium's `App.jsx` for the exact pattern. |

## Layout Shells `✅ VERIFIED`

`src/layout/MainLayout.jsx` is the only shell today. Structure:

```jsx
<div className="font-raleway min-h-screen flex flex-col">
  <Navbar />
  <main className="flex-1">
    <Outlet />
  </main>
  <Footer />
</div>
```

When auth lands, add a `ProtectedRoute` wrapper (see elysium pattern) that redirects unauthenticated users to a login route.

## Adding a Route

1. Create the page in `src/pages/<Name>Page.jsx`.
2. Add the path to `src/constants/routes.js` (`ROUTES.foo = '/foo'`).
3. Register the route in `src/App.jsx` under the appropriate layout.
4. Add nav-link in `src/components/shared/Navbar.jsx` if user-facing.
5. Append a Playwright spec under `tests/e2e/` if the page is not trivial.
6. Update `wiki/components.md` and `wiki/log.md`.
