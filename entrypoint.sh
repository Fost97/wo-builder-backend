#!/bin/sh
set -e

# Esegui migration
npx prisma migrate deploy

# Avvia server
exec node dist/index.js