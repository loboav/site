import * as express from 'express';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS
  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  });

  // Настраиваем статическую папку для загрузки изображений
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  console.log(`Сервер запущен на http://localhost:${PORT}`);
}

bootstrap();