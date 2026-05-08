# Architecture

## Tech Stack `✅ VERIFIED`

| Layer           | Tech                    | Version (from package.json)     |
| --------------- | ----------------------- | ------------------------------- |
| Build           | Vite                    | ^7.0.4                          |
| UI              | React                   | ^19.2.0                         |
| Routing         | React Router DOM        | ^6.30.1                         |
| State           | Redux Toolkit           | ^2.11.2                         |
| State (persist) | redux-persist           | ^6.0.0                          |
| HTTP            | axios                   | ^1.12.2                         |
| Forms           | react-hook-form         | ^7.54.0                         |
| Validation      | zod                     | ^3.24.1                         |
| Form bridge     | @hookform/resolvers     | ^3.9.1                          |
| Styling         | Tailwind CSS            | ^4.1.11 (via @tailwindcss/vite) |
| Cookies         | universal-cookie        | ^8.0.1                          |
| Lint            | ESLint flat config      | ^9.30.1                         |
| Format          | Prettier                | ^3.4.2                          |
| E2E             | Playwright              | ^1.49.1                         |
| Hooks           | Husky + lint-staged     | ^9.1.7 / ^15.3.0                |
| Commits         | commitlint conventional | ^19.6.x                         |

Language: **plain JavaScript** (no TypeScript), mirroring elysium.

## Directory Structure `✅ VERIFIED`

```
talenthub-frontend/
├── .claude/                # Claude Code project settings
├── .husky/                 # pre-commit + commit-msg hooks
├── .vscode/                # editor recommendations
├── public/                 # static, served as-is by Vite
├── src/
│   ├── admin/              # reserved for future lazy-loaded admin subsystem
│   ├── assets/             # imported images/icons
│   ├── components/
│   │   ├── ui/             # primitives (Button, Input, Modal)
│   │   ├── shared/         # cross-feature (Navbar, Footer)
│   │   ├── sections/       # per-feature page sections
│   │   └── cards/          # reusable card components
│   ├── constants/          # ROUTES, STORAGE_KEYS, etc.
│   ├── hooks/              # custom React hooks
│   ├── layout/             # layout shells (MainLayout)
│   ├── pages/              # top-level routed pages
│   ├── providers/          # context providers, redux <Provider> wiring
│   ├── services/           # API clients (axios instance)
│   ├── store/              # Redux Toolkit store + slices/
│   ├── utils/              # leaf utilities (classNames, debug)
│   ├── App.jsx             # BrowserRouter + Routes
│   ├── App.css             # minimal global resets
│   ├── index.css           # Tailwind v4 @theme tokens
│   └── main.jsx            # React.StrictMode + createRoot
├── tests/e2e/              # Playwright specs
├── wiki/                   # this knowledge base
├── .env.example
├── .mcp.json               # Playwright + Figma MCP servers
├── CLAUDE.md
├── eslint.config.js
├── playwright.config.js
├── tailwind.config.js      # mostly informational; tokens live in src/index.css
├── vercel.json
└── vite.config.js
```

## Entry Points `✅ VERIFIED`

| Order | File                        | Responsibility                                         |
| ----- | --------------------------- | ------------------------------------------------------ |
| 1     | `index.html`                | mounts `#root`, loads `/src/main.jsx`                  |
| 2     | `src/main.jsx`              | StrictMode + createRoot, imports `index.css`           |
| 3     | `src/App.jsx`               | BrowserRouter + Routes (config-based, mirrors elysium) |
| 4     | `src/layout/MainLayout.jsx` | Navbar + `<Outlet/>` + Footer shell                    |
| 5     | `src/pages/HomePage.jsx`    | placeholder home page                                  |

## Key Conventions `✅ VERIFIED`

- **Routing**: config-based in `App.jsx` (not file-based). `/admin/*` slot reserved for lazy-loaded admin (see [routing.md](routing.md)).
- **Styling**: Tailwind v4 utility classes + design tokens defined in `src/index.css` `@theme` block.
- **State**: Redux Toolkit store in `src/store/index.js`. Slices live under `src/store/slices/`.
- **API**: single axios instance in `src/services/api.js` reading `VITE_API_BASE_URL`. Auth-token interceptor reads from `localStorage` via `STORAGE_KEYS`.
- **Debug**: `debug(scope)` helper in `src/utils/debug.js` — dev-only, prefixed. See [debugging-workflow.md](debugging-workflow.md).
- **File naming**: PascalCase components/pages, camelCase utilities, UPPER_SNAKE constant exports. See CLAUDE.md §8.
