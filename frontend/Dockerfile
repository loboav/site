# Используем обновленный образ Node.js с минимальными уязвимостями
FROM node:18.16.0-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем .env.example
COPY .env.example .env.example

# Копируем .env.example и создаём .env, если его нет
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Копируем весь проект
COPY . .

# Собираем проект
RUN npm run build

# Указываем порт, который будет использоваться
EXPOSE 5173

# Запускаем приложение
CMD ["npm", "run", "preview", "--", "--host"]