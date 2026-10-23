#!/bin/bash
# Replaces the app's running container with one of the image just loaded on the VPS (onlineresume:latest). Run on the
# VPS, from the home directory, by each deploy (.github/workflows/deploy.yml, deploy.sh): `ssh ... 'bash -s' < this`.
# The site is down only from the old container's stop to the new one's start, a few seconds. See ARCHITECTURE.md
set -euo pipefail

# None on the first deploy
if sudo docker container inspect onlineresume >/dev/null 2>&1; then
    sudo docker stop onlineresume
    sudo docker rm onlineresume
fi

# --dns: don't depend on the host's resolver, which some VPS hosts make unreachable from inside containers
sudo docker run -d --name onlineresume \
    --restart unless-stopped \
    --dns 8.8.8.8 --dns 1.1.1.1 \
    -p 80:80 -p 443:443 \
    -v ./database:/app/backend/database \
    -v ./httpsEncryption:/etc/letsencrypt \
    -v ./backend.env.production.local:/app/backend/.env.production.local:ro \
    onlineresume:latest

# The previous version's image, which docker load left without a name
sudo docker image prune --force
