#!/bin/sh
# Uruchamia PHP-FPM i Caddy w jednym kontenerze (PID 1 to tini).
# Gdy którykolwiek z procesów się zakończy, kontener kończy działanie,
# a silnik kontenerów może go zrestartować.
set -eu

if [ "$#" -gt 0 ]; then
    exec "$@"
fi

# shellcheck disable=SC2086 # PHP_FPM_ARGS celowo dzielone na słowa
php-fpm ${PHP_FPM_ARGS:-} &
fpm_pid=$!

caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &
caddy_pid=$!

stop_all() {
    # SIGQUIT: łagodne zamknięcie PHP-FPM, SIGTERM: łagodne zamknięcie Caddy
    kill -QUIT "$fpm_pid" 2>/dev/null || true
    kill -TERM "$caddy_pid" 2>/dev/null || true
    wait 2>/dev/null || true
}

trap 'stop_all; exit 0' TERM INT QUIT

# Busybox `wait -n` reaguje tylko na ostatnio uruchomione zadanie,
# dlatego sprawdzamy oba procesy w pętli. `sleep & wait` pozwala
# obsłużyć sygnał zatrzymania bez czekania na koniec `sleep`.
while kill -0 "$fpm_pid" 2>/dev/null && kill -0 "$caddy_pid" 2>/dev/null; do
    sleep 1 &
    wait $! || true
done

status=0
if ! kill -0 "$fpm_pid" 2>/dev/null; then
    wait "$fpm_pid" || status=$?
else
    wait "$caddy_pid" || status=$?
fi

echo "entrypoint: jeden z procesów zakończył działanie (kod $status), zatrzymuję kontener" >&2
stop_all
[ "$status" -eq 0 ] && status=1
exit "$status"
