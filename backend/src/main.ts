import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS, чтобы фронт мог отправлять запросы
  app.enableCors({
    origin: "http://localhost:5173", // Укажи правильный порт фронта
    credentials: true, // Если используешь авторизацию через куки
  });

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  console.log(`Сервер запущен на http://localhost:${PORT}`);
}

bootstrap();
