FROM php:8.2-apache

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    unzip zip git curl libzip-dev libssl-dev pkg-config libcurl4-openssl-dev \
    && docker-php-ext-install zip

# Instalar a extensão MongoDB
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Habilitar mod_rewrite do Apache
RUN a2enmod rewrite

# Definir diretório de trabalho
WORKDIR /var/www/html

# Copiar todos os arquivos do projeto
COPY . .

# Instalar dependências PHP do Laravel
RUN composer install --no-dev --prefer-dist --no-scripts

# Permissões para Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Definir o diretório público como raiz do Apache
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# Atualizar configs do Apache para servir o Laravel corretamente
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

EXPOSE 80

CMD ["apache2-foreground"]
