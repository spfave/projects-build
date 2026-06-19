#!/usr/bin/env bash
# chmod +x $0
set -euo pipefail
echo "POST CREATE SCRIPT"

# PNPM config
export PATH="$PNPM_HOME/bin:$PATH"
pnpm config set -g store-dir "$PNPM_HOME/store"
pnpm config set -g global-bin-dir "$PNPM_HOME/bin"