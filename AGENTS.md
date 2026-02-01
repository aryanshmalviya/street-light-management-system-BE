# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds all runtime code, with feature slices split across `controllers/`, `services/`, `routes/`, `middleware/`, and `utils/`.
- `src/database/` contains connection setup and migration/seed entry points.
- `src/mqtt/` contains MQTT integration logic used by the server at startup.
- `logs/` stores Winston output (`error.log`, `combined.log`).
- API docs and setup guides live at the repo root (see `README.md`, `QUICKSTART.md`).

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm start` runs `src/server.js` with Node.
- `npm run dev` starts the server with `nodemon` auto-reload.
- `npm run dev:clean` force-kills existing dev processes and restarts.
- `npm run migrate` runs DB schema creation (`src/database/migrations.js`).
- `npm run seed` seeds the database (`src/database/seed.js`).
- `npm run diagnose` checks DB connectivity (`diagnose-db.js`).
- `npm run verify` runs local setup checks (`verify-setup.js`).

## Coding Style & Naming Conventions
- JavaScript (CommonJS) with semicolons and 2-space indentation.
- Files follow `camelCase` and descriptive suffixes: `*Controller.js`, `*Service.js`, `*Routes.js`.
- Route paths are kebab-case (e.g., `/api/automation-rules`).
- Keep request validation in routes/controllers and business logic in `services/`.

## Testing Guidelines
- Tests use Jest (`npm test`). No test files are currently tracked in the repo.
- If adding tests, prefer `__tests__/` or `*.test.js` co-located with the module under `src/`.
- Use Supertest for API route coverage where possible.

## Commit & Pull Request Guidelines
- Commit history is short and uses simple, lowercase summaries (e.g., “adding maintenance apis”).
- Aim for concise, imperative messages ("add", "fix", "update") and keep scope clear.
- PRs should include: summary of changes, how to test, and any DB migration/seed steps.

## Security & Configuration Tips
- Use `.env` for secrets (`DATABASE_URL`, `JWT_SECRET`, `PORT`).
- Default API docs run at `http://localhost:3000/api-docs` when the server is up.
- Do not commit real credentials or production connection strings.
