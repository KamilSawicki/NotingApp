# NotingApp

## About

A note-taking app inspired by Notion. Notes are written in Markdown, organized in a tree and can be linked to each other. An AI agent can access notes through an MCP server, with per-note access modes and masking of private data. Notes can be styled with CSS and exported to PDF.

Stack: Symfony 8.1 on PHP 8.6 (PHP-FPM), Caddy, PostgreSQL. The app ships as a single container image; the database runs outside of it.

## Run

```sh
podman build -t noting-app .
podman run -d -p 8080:8080 \
  -e APP_SECRET=<secret> \
  -e DATABASE_URL='postgresql://user:password@host:5432/db?serverVersion=19&charset=utf8' \
  noting-app
```

The app is available at <http://localhost:8080>.

## Run dev mode

```sh
podman-compose build
podman-compose run --rm app composer install
podman-compose up -d
```

This starts the app at <http://localhost:8080> with PostgreSQL (user, password and database: `app`). Source code is mounted from the host, so changes are visible without rebuilding.

Run Symfony commands with `podman-compose exec app php bin/console <command>`.

Xdebug connects to your IDE on port `9003`. Map `/app` to the project directory and start a session with the `XDEBUG_TRIGGER=1` query parameter (or environment variable for CLI). Disable it with `XDEBUG_MODE=off podman-compose up -d`.
