# Pre-Commit Workflow

## What runs `✅ VERIFIED`

Husky wires two hooks:

| Hook         | Script                                    | Purpose                                                                  |
| ------------ | ----------------------------------------- | ------------------------------------------------------------------------ |
| `pre-commit` | `npx lint-staged`                         | runs eslint --fix + prettier --write on staged `.js/.jsx/.json/.css/.md` |
| `commit-msg` | `npx --no-install commitlint --edit "$1"` | rejects commits that don't match conventional-commits format             |

Configuration:

- `lint-staged` block in `package.json`
- `commitlint.config.js` (extends `@commitlint/config-conventional`)
- `.husky/pre-commit`, `.husky/commit-msg`

## Why `✅ VERIFIED`

CI (when wired) will run `npm run build` and reject failures. ESLint + Prettier + commitlint catch the common issues earlier — at commit time — instead of after a push.

## Mandatory before pushing

Run **all** of these clean before pushing:

```bash
npm run lint
npm run format:check
npm run build
npm run test:e2e
```

If any fail, fix the underlying issue. Do NOT bypass with `git commit --no-verify` or `git push --no-verify`.

## Common lint fixes

| Error                                           | Fix                                                                                                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `'X' is defined but never used`                 | Remove the import/variable. ESLint config ignores names matching `^[A-Z_]` (constants/components), so prefix locals with `_` if intentionally unused.  |
| `'X' is assigned a value but never used`        | Same as above.                                                                                                                                         |
| `React Hook useEffect has a missing dependency` | Add the dependency, wrap in `useCallback`, or — last resort — `// eslint-disable-next-line react-hooks/exhaustive-deps` with a comment explaining why. |
| `img elements must have an alt prop`            | Add `alt="..."` (use `alt=""` for purely decorative images).                                                                                           |
| `'X' is not defined`                            | Import the missing module.                                                                                                                             |
| `Do not use Array index in keys`                | Use a unique identifier instead of `index`.                                                                                                            |

## Commit message format

Conventional commits: `type(scope): subject`

Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`, `ci`, `build`, `revert`.

Examples:

```
feat(home): add hero section
fix(api): retry on 401 with refresh token
chore: bump vite to 7.1.0
docs(wiki): record figma migration in log
```

`commitlint.config.js` raises the header limit to 100 chars (default 72 is too tight for scoped messages).

## Console.log handling

The project uses many `console.log` / `debug()` calls during active development (see [debugging-workflow.md](debugging-workflow.md)). The current ESLint config does NOT flag them. If a future config change adds `no-console`, prefer the `debug()` helper or use a targeted disable:

```javascript
// eslint-disable-next-line no-console
console.log('[ComponentName] debug:', data);
```

## When CI fails

1. Read the failing log.
2. Reproduce locally with the same command.
3. Fix and create a new commit (don't `--amend` after a hook failure — see CLAUDE.md).
4. Push again.
