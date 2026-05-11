#!/usr/bin/env bash

echo "Clearing caches..."
php artisan optimize:clear

echo "Running Database Migrations..."
# Menggunakan --force sangat penting di production agar tidak ada prompt konfirmasi
php artisan migrate --force

echo "Starting Apache Server..."
# Menjalankan server Apache di foreground (terus menyala)
apache2-foreground
