#!/bin/sh
# Runs the template tests in Playwright's Linux image, like the CI does: the screenshots are the same on every machine.
# Arguments are passed to Playwright, e.g. --update-snapshots
set -e

# Same version as @playwright/test (package-lock.json) and as .github/workflows/tests.yml
IMAGE=mcr.microsoft.com/playwright:v1.54.1-noble
REPO=$(cd "$(dirname "$0")/../../.." && pwd)

if ! docker info >/dev/null 2>&1; then
    echo "The template tests run in Docker: start Docker first." >&2
    exit 1
fi

# amd64 like GitHub's machines (on Apple Silicon, Docker emulates it): Puppeteer has no Chrome for Linux on ARM.
# The dependencies are installed for Linux in volumes of their own, and again only when package-lock.json changes
exec docker run --rm --init --ipc=host --platform linux/amd64 \
    -v "$REPO":/work \
    -v opencv-templates-frontend-modules:/work/frontend/node_modules \
    -v opencv-templates-backend-modules:/work/backend/node_modules \
    -v opencv-templates-puppeteer:/root/.cache/puppeteer \
    -w /work/frontend -e CI=1 \
    "$IMAGE" sh -c '
        for dir in /work/frontend /work/backend; do
            hash=$(sha1sum "$dir/package-lock.json" | cut -d" " -f1)
            if [ "$(cat "$dir/node_modules/.lock-hash" 2>/dev/null)" != "$hash" ]; then
                (cd "$dir" && npm ci --no-audit --no-fund && echo "$hash" > node_modules/.lock-hash)
            fi
        done
        npx playwright test "$@"
    ' sh "$@"
