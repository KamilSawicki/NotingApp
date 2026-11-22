# NotingApp

## About

A note-taking app. Notes are written in Markdown, organized in a tree and can be linked to each other. An AI agent can access notes through an MCP server, with per-note access modes and masking of private data. Notes can be styled with CSS and exported to PDF.

Stack: Symfony 8.1 on PHP 8.6 (PHP-FPM), Caddy, PostgreSQL, Vue 3 (Vite). The app ships as a single container image; the database runs outside of it.

## Run

The image expects frontend assets to be built beforehand (in CI), so build them first:

```sh
yarn install --immutable && yarn build
podman build -t noting-app .
podman run -d -p 8080:8080 \
  -e APP_SECRET=<secret> \
  -e DATABASE_URL='postgresql://user:password@host:5432/db?serverVersion=19&charset=utf8' \
  -v noting-data:/app/var/share \
  noting-app
```

The app is available at <http://localhost:8080>.

Persistent data, including uploaded files, is stored in `var/share`, so mount a volume there. Don't mount the whole `var/`: `var/cache` holds the cache built into the image and must be replaced with each new image. When using a host directory instead of a named volume, add `:U,Z` (e.g. `-v ./data:/app/var/share:U,Z`) so the container user can write to it (`Z` sets the SELinux label).

## Run dev mode

```sh
podman-compose build
podman-compose run --rm app composer install
podman-compose up -d
```

This starts the app at <http://localhost:8080> with PostgreSQL (user, password and database: `app`) and the Vite dev server on port `5173`, which serves the frontend with hot reload. Source code is mounted from the host, so changes are visible without rebuilding.

Run Symfony commands with `podman-compose exec app php bin/console <command>` and Yarn commands with `podman-compose exec node yarn <command>`, e.g. `yarn lint` (ESLint) and `yarn format` (Prettier).

Xdebug connects to your IDE on port `9003`. Map `/app` to the project directory and start a session with the `XDEBUG_TRIGGER=1` query parameter (or environment variable for CLI). Disable it with `XDEBUG_MODE=off podman-compose up -d`.
