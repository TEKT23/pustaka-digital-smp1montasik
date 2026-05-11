FROM php:8.4-apache

# 1. Install sistem dependensi, Node.js, dan Driver PostgreSQL (untuk Supabase)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# 2. Aktifkan modul Rewrite Apache (wajib untuk routing Laravel)
RUN a2enmod rewrite

# 3. Ubah DocumentRoot Apache ke folder /public Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 4. Ambil Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Set Working Directory
WORKDIR /var/www/html

# 6. Salin semua file proyek ke dalam container
COPY . .

# 7. Install PHP dependencies & Node dependencies, lalu build frontend (Vite)
RUN composer install --optimize-autoloader --no-dev
RUN npm install --legacy-peer-deps
RUN npm run build

# 8. Set izin (permissions) untuk folder storage agar Laravel bisa menulis log/cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 9. Penyesuaian Port untuk Render (Render akan memberikan port dinamis via environment variable $PORT)
RUN sed -i "s/80/\${PORT}/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# 10. Salin dan beri izin eksekusi untuk skrip startup
COPY render-start.sh /usr/local/bin/render-start.sh
RUN chmod +x /usr/local/bin/render-start.sh

# 11. Jalankan skrip saat container menyala
CMD ["render-start.sh"]
