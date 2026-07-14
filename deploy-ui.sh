#!/usr/bin/env bash
# Fast UI deploy: build the SolidJS UI locally and copy dist into the
# running `xenovradrive` container's /ui (served live by the Rust app).
# No Docker image rebuild, no container restart — takes seconds.
set -euo pipefail

cd "$(dirname "$0")/ui"

echo "==> Building UI (VITE_API_BASE=/api)..."
VITE_API_BASE=/api pnpm build

echo "==> Copying dist into container /ui ..."
# Image is FROM scratch (no shell), so we can't rm inside. index.html always
# points at the newest hashed assets; old hashed files are harmless leftovers.
docker cp ./dist/. xenovradrive:/ui

echo "==> Done. Live at http://194.163.131.63:8000 (hard-refresh: Ctrl+Shift+R)"
