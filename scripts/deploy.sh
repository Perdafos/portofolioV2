#!/usr/bin/env bash

set -euo pipefail

HOST_NAME="${1:-}"
PORT="${2:-22}"
TARGET_DIR="${3:-}"

if [[ -z "$HOST_NAME" || -z "$TARGET_DIR" ]]; then
  echo "Usage: ./scripts/deploy.sh <host> <port> <target_dir>"
  exit 1
fi

if [[ ! -d "dist" ]]; then
  echo "Folder dist tidak ditemukan. Jalankan build terlebih dahulu."
  exit 1
fi

ARCHIVE_NAME="dist-${BUILD_NUMBER:-local}.tar.gz"
REMOTE_ARCHIVE="/tmp/${ARCHIVE_NAME}"
SSH_TARGET="${HOST_NAME}"

echo "Packing dist..."
tar -C dist -czf "$ARCHIVE_NAME" .

echo "Uploading artifact to ${SSH_TARGET}:${REMOTE_ARCHIVE}"
scp -P "$PORT" -o StrictHostKeyChecking=no "$ARCHIVE_NAME" "${SSH_TARGET}:${REMOTE_ARCHIVE}"

echo "Extracting artifact to ${TARGET_DIR}"
ssh -p "$PORT" -o StrictHostKeyChecking=no "$SSH_TARGET" "mkdir -p '${TARGET_DIR}' && rm -rf '${TARGET_DIR}'/* && tar -xzf '${REMOTE_ARCHIVE}' -C '${TARGET_DIR}' && rm -f '${REMOTE_ARCHIVE}'"

rm -f "$ARCHIVE_NAME"
echo "Deploy selesai ke ${HOST_NAME}:${TARGET_DIR}"