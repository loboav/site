# Используем обновленный образ Node.js с минимальными уязвимостями
FROM node:18.18.0-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Устанавливаем OpenSSL для работы Prisma
RUN apt-get update -y && apt-get install -y openssl

# Устанавливаем PostgreSQL клиент для проверки подключения к базе данных
RUN apt-get update -y && apt-get install -y postgresql-client

# Копируем весь проект
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Собираем проект
RUN npm run build

# Указываем порт, который будет использоваться
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run", "start:prod"]