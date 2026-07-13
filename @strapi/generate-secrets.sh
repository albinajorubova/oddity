#!/bin/bash
# Скрипт для генерации всех секретов для Strapi 5

echo "# Сгенерированные секреты для Strapi 5"
echo "# Скопируйте эти значения в ваш .env файл"
echo ""
echo "APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)"
echo "ADMIN_JWT_SECRET=$(openssl rand -base64 32)"
echo "API_TOKEN_SALT=$(openssl rand -base64 32)"
echo "TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)"
echo "ENCRYPTION_KEY=$(openssl rand -base64 32)"

