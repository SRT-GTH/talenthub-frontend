# Debugging Workflow

## Console Logging Convention `✅ VERIFIED` (mandatory)

**Every new code MUST include debug logs for each logical step.** Logs make Playwright-MCP-driven verification fast and catch unexpected state early. Adapted from MangoTV's convention.

### Format

Use the `debug(scope)` helper from `src/utils/debug.js`. It auto-prefixes and is dev-gated (silent in prod).

```javascript
import { debug } from '../utils/debug.js';
const log = debug('HomePage');

log('mount');
log('fetching content...');
log('categories loaded:', categories.length);
log('moviesByCategories:', Object.keys(moviesByCategories));
log.error('failed to load categories:', { error: err.message, endpoint });
```

If you must use raw `console`, follow the same prefix pattern: `console.log('[HomePage] step:', data)`.

### Required at every:

1. **Async operation** — log before the call, log response shape, log errors with context (id, type, endpoint)
2. **Component mount** — log key props/state received
3. **Conditional branch** — log which branch was taken and why
4. **Redux dispatch** — log action type + key payload fields
5. **API response** — log status + data shape (not full payload)
6. **Style-affecting calculation** — log computed values (widths, heights, item counts)

### Example (good)

```javascript
const log = debug('Navbar');

const Navbar = () => {
  const user = useSelector((s) => s.auth.user);
  log('render, authed:', !!user);

  const handleLogout = async () => {
    log('logout clicked');
    try {
      await api.post('/sessions/logout');
      log('logout ok');
      dispatch(clearAuth());
    } catch (err) {
      log.error('logout failed:', { message: err.message, status: err.response?.status });
    }
  };
  // ...
};
```

### Verification with Playwright MCP

After writing code:

1. Run `npm run dev` (or rely on Playwright `webServer`).
2. Use Playwright MCP `browser_navigate` to the affected page.
3. Use `browser_console_messages` to verify logs appear in expected order with expected payloads.
4. Use `browser_take_screenshot` for visual verification.
5. Compare layout against Figma if a design exists (see [figma-fidelity.md](figma-fidelity.md)).

### Lifecycle

- **Keep logs during active development** — they're the audit trail when something breaks.
- **Cleanup pass before release** — strip debug logs in one sweep when a feature is signed off, not piecemeal during development.
- Production builds are silent because `debug()` returns no-ops when `import.meta.env.DEV` is false.

### Counting logs (audit)

```bash
# rough count of debug-helper usage
grep -rn "debug(" src/ | wc -l

# raw console.log usage
grep -rn "console\\.log" src/ | wc -l
```

## Error Handling

Always log errors with context, not just the error object:

```javascript
log.error('failed to do X:', {
  error: err.message,
  status: err.response?.status,
  context: { id, type, endpoint },
});
```
