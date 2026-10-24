#!/bin/bash
# Replaces the app's running container with one of the image just loaded on the VPS (onlineresume:latest). Run on the
# VPS, from the home directory, by each deploy (.github/workflows/deploy.yml, deploy.sh): `ssh ... 'bash -s' < this`.
# The site is down only from the old container's stop to the new one's start, a few seconds. If the new one doesn't
# answer within a minute, the old one is started again and the deploy fails. See ARCHITECTURE.md
set -euo pipefail

# The previous version is kept stopped until the new one answers, to start it again otherwise: the running container,
# else the one a deploy interrupted during the swap left stopped. None on the first deploy
if sudo docker container inspect onlineresume >/dev/null 2>&1; then
    sudo docker rm --force onlineresume-previous >/dev/null 2>&1 || true
    sudo docker rename onlineresume onlineresume-previous
fi
if sudo docker container inspect onlineresume-previous >/dev/null 2>&1; then
    sudo docker stop onlineresume-previous
fi

start_new_version() {
    # --dns: don't depend on the host's resolver, which some VPS hosts make unreachable from inside containers.
    # --log-driver: the logs go to the VPS's journal, which keeps them once the container is removed (see ARCHITECTURE.md)
    sudo docker run -d --name onlineresume \
        --restart unless-stopped \
        --dns 8.8.8.8 --dns 1.1.1.1 \
        --log-driver journald \
        -p 80:80 -p 443:443 \
        -v ./database:/app/backend/database \
        -v ./httpsEncryption:/etc/letsencrypt \
        -v ./backend.env.production.local:/app/backend/.env.production.local:ro \
        onlineresume:latest
}

# Through nginx, like visitors: the backend answers /api/ with a 404, nginx answers 502 while the backend is down
answers() {
    local status
    status=$(curl --silent --insecure --output /dev/null --write-out '%{http_code}' --max-time 5 \
        --resolve onlineresume.dev:443:127.0.0.1 https://onlineresume.dev/api/) || true
    [ "$status" -ge 200 ] && [ "$status" -lt 500 ]
}

wait_until_it_answers() {
    for _ in $(seq 30); do
        answers && return 0
        sleep 2
    done
    return 1
}

if start_new_version && wait_until_it_answers; then
    echo "The new version answers"
    sudo docker rm onlineresume-previous >/dev/null 2>&1 || true
    # The previous version's image, which docker load left without a name
    sudo docker image prune --force
    exit 0
fi

echo "The new version doesn't answer. Its last logs:" >&2
sudo docker logs --tail 100 onlineresume >&2 || true
sudo docker rm --force onlineresume >/dev/null 2>&1 || true
if sudo docker container inspect onlineresume-previous >/dev/null 2>&1; then
    sudo docker rename onlineresume-previous onlineresume
    sudo docker start onlineresume
    echo "The previous version is running again" >&2
fi
exit 1
