#!/bin/sh
# Brings the analytics table up to date, then starts the site. Without a
# database the site still runs; it just records nothing.
if [ -n "$DATABASE_URL" ]; then
  echo "Applying database schema..."
  if prisma db push --schema=./prisma/schema.prisma --url "$DATABASE_URL" 2>&1; then
    echo "Schema: OK"
  else
    # No --accept-data-loss on purpose: a change that would drop data should
    # stop here and be looked at, not run by itself on deploy.
    echo "WARNING: schema was NOT applied. Analytics may fail until it is fixed."
  fi
else
  echo "DATABASE_URL not set: analytics disabled."
fi
exec node server.js
