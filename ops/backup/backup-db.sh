#!/bin/bash
# Backs up the app's SQLite database to Cloudflare R2, compressed and encrypted with age. Run every night by
# onlineresume-backup.timer, with the settings and secrets of /etc/onlineresume-backup.env. See ARCHITECTURE.md
set -euo pipefail

: "${AGE_RECIPIENT:?missing in /etc/onlineresume-backup.env}"
: "${R2_BUCKET:?missing in /etc/onlineresume-backup.env}"

DATABASE=/home/ubuntu/database/database.db
name="database-$(date -u +%Y-%m-%dT%H%M%SZ).db"

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

# .backup gives a consistent copy even while the app is writing, unlike copying the file
sqlite3 "$DATABASE" ".backup '$work/$name'"
integrity=$(sqlite3 "$work/$name" "PRAGMA integrity_check;")
[ "$integrity" = "ok" ] || { echo "The copy failed SQLite's integrity check: $integrity" >&2; exit 1; }

gzip -9 "$work/$name"
age --recipient "$AGE_RECIPIENT" --output "$work/$name.gz.age" "$work/$name.gz"
rclone copyto "$work/$name.gz.age" "r2:$R2_BUCKET/db/$name.gz.age"

echo "Backed up $name.gz.age ($(stat -c %s "$work/$name.gz.age") bytes)"
