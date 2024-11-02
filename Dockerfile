FROM node:16-slim

# Установка зависимостей для Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    libpuppeteer-extra-plugin-stealth \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Создание рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода
COPY . .

# Создание директории для сессии WhatsApp
RUN mkdir -p .wwebjs_auth/session

# Запуск приложения
CMD ["npm", "start"] 