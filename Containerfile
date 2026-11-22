ARG PHP_VERSION=8.6
ARG CADDY_VERSION=2.11.9
ARG COMPOSER_VERSION=2.11.2
ARG PHP_EXTENSION_INSTALLER_VERSION=2.13.2
ARG XDEBUG_VERSION=xdebug/xdebug@5e19866c1766e38c527f9f94faa170370dc4209f

FROM docker.io/library/caddy:${CADDY_VERSION}-alpine AS caddy
FROM docker.io/library/composer:${COMPOSER_VERSION} AS composer
FROM docker.io/mlocati/php-extension-installer:${PHP_EXTENSION_INSTALLER_VERSION} AS php-extension-installer

FROM docker.io/library/php:${PHP_VERSION}-fpm-alpine AS base

COPY --from=php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions \
        intl \
        mbstring \
        pdo_pgsql \
    && rm /usr/local/bin/install-php-extensions \
    && apk add --no-cache tini

COPY --from=caddy /usr/bin/caddy /usr/local/bin/caddy

WORKDIR /app

COPY container/php/conf.d/app.ini /usr/local/etc/php/conf.d/zz-app.ini
COPY container/php/php-fpm.d/zz-app.conf /usr/local/etc/php-fpm.d/zz-app.conf
COPY container/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --chmod=755 container/entrypoint.sh /usr/local/bin/entrypoint

ENV XDG_CONFIG_HOME=/tmp/caddy/config \
    XDG_DATA_HOME=/tmp/caddy/data \
    SERVER_NAME=:8080

EXPOSE 8080
STOPSIGNAL SIGTERM
ENTRYPOINT ["/sbin/tini", "--", "entrypoint"]

FROM base AS dev

COPY --from=php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
ARG XDEBUG_VERSION
RUN install-php-extensions ${XDEBUG_VERSION} \
    && rm /usr/local/bin/install-php-extensions

COPY --from=composer /usr/bin/composer /usr/local/bin/composer

RUN cp /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini
COPY container/php/conf.d/app.dev.ini /usr/local/etc/php/conf.d/zz-app.dev.ini
COPY container/php/php-fpm.d/zz-app.dev.conf /usr/local/etc/php-fpm.d/zz-app.dev.conf

ENV APP_ENV=dev \
    COMPOSER_ALLOW_SUPERUSER=1 \
    PHP_FPM_ARGS=--allow-to-run-as-root \
    XDEBUG_MODE=debug

FROM base AS vendor

COPY --from=composer /usr/bin/composer /usr/local/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    APP_ENV=prod

COPY composer.json composer.lock symfony.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-progress --no-interaction

COPY . .
RUN rm -rf container
RUN grep -q '"viteServer": null' public/build/.vite/entrypoints.json \
    || { echo 'public/build is missing or comes from the Vite dev server, run "yarn build" first' >&2; exit 1; }
RUN composer dump-autoload --no-dev --classmap-authoritative \
    && composer run-script --no-dev post-install-cmd \
    && chmod +x bin/console

FROM base AS prod

ENV APP_ENV=prod \
    APP_DEBUG=0

RUN cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini
COPY container/php/conf.d/app.prod.ini /usr/local/etc/php/conf.d/zz-app.prod.ini

COPY --from=vendor --chown=www-data:www-data /app /app

USER www-data
