#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Deploy a Cloudflare Pages
# ============================================================
# Requiere:
#   export CLOUDFLARE_API_TOKEN="..."
#   export CLOUDFLARE_ACCOUNT_ID="..."
# O bien: npx wrangler login (interactivo)
# ============================================================

echo ">> Build de producción..."
npm run build

echo ">> Deploy a Cloudflare Pages..."
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "  (Sin token API: usando wrangler login interactivo)"
  npx wrangler pages deploy dist --project-name=pena-betica-bus
else
  npx wrangler pages deploy dist \
    --project-name=pena-betica-bus \
    --commit-dirty=true
fi

echo ">> Done."
