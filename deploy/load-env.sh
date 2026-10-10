#!/bin/sh
# Rebuilds /opt/wiki/.env from SSM Parameter Store (/wiki/*) at every deploy.
set -eu
REGION="$1"
cd /opt/wiki
umask 077

aws ssm get-parameters-by-path --region "$REGION" --path /wiki --with-decryption \
  --query "Parameters[].[Name,Value]" --output text \
  | awk -F'\t' '{ n=$1; sub(".*/","",n); print n "=" $2 }' > .env.new

for k in DB_URL DB_USERNAME DB_PASSWORD HF_API_TOKEN CLERK_SECRET_KEY NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY; do
  grep -q "^$k=." .env.new || { echo "ERROR: $k missing or empty in Parameter Store"; rm -f .env.new; exit 1; }
done

if [ -f .env ]; then cp -f .env .env.prev; fi
mv .env.new .env
echo "OK: .env rebuilt ($(wc -l < .env) variables)"