# AGENTS — Project guidance for AI coding agents

Purpose: give concise, actionable terminal and run instructions so agents can start, test, and debug services quickly.

Key locations
- **Backend (Nest + Prisma)**: [federation-back/package.json](federation-back/package.json#L1-L400) — contains `scripts` for `start`, `start:dev`, `start:prod`, `build`, `studio`, and test commands.
- **Frontend (simple Node server)**: [total_federation_v2/package.json](total_federation_v2/package.json#L1-L200) and [total_federation_v2/start.command](total_federation_v2/start.command#L1-L50) — use `npm start` or run `start.command` to launch `server.js` (serves on http://localhost:8080).

Terminal conventions for agents
- Always `cd` into the folder containing the `package.json` you intend to use before running `npm` scripts (e.g., `cd federation-back` or `cd total_federation_v2`).
- Preferred commands:
  - Backend development: `npm run start:dev` (from `federation-back`).
  - Backend production run: `npm run start:prod` (from `federation-back`, requires build step `npm run build`).
  - Prisma studio: `npm run studio` (from `federation-back`).
  - Frontend: `npm start` or execute [total_federation_v2/start.command](total_federation_v2/start.command#L1-L50).

Environment and common pitfalls
- The repo has multiple subprojects; running scripts from the wrong directory is the most common failure. If a command fails, check `pwd` and the nearest `package.json`.
- Node version: use a modern Node.js (v18+ recommended). If CI or local dev uses a different Node, consider using `nvm`.
- Some backend scripts rely on Nest and TypeScript build output—use `npm run build` before `npm run start:prod`.

What agents should do and not do
- Do: link to docs rather than copying them; run scripts from the correct subfolder; surface errors and logs to the user.
- Do not: modify environment secrets or run commands that require interactive credentials without explicit user approval.

Next suggested customizations
- Create small skills for common tasks: `start-backend`, `start-frontend`, `run-tests`, `open-prisma-studio` that encapsulate the correct `cd` and `npm` invocations.

If you want, I can create the `start-backend` and `start-frontend` agent skills next.
