# Instalar dependências via Composer
FROM composer:2 AS build

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-scripts

# Imagem PHP com Apache
FROM php:8.2-apache

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl libssl-dev pkg-config libcurl4-openssl-dev \
    && docker-php-ext-install zip

# Instalar extensões PHP necessárias
RUN pecl install mongodb \
    && docker-php-ext-enable mongodb

# Ativar mod_rewrite do Apache
RUN a2enmod rewrite

# Copiar projeto Laravel
WORKDIR /var/www/html
COPY . ./
COPY --from=build /app/vendor ./vendor

# Permissões para o Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Definir diretório público como raiz
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# Ajustar configuração do Apache
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Expor porta
EXPOSE 80

CMD ["apache2-foreground"]