import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma/prisma.service'; // <-- Импорт PrismaService

@Module({
  providers: [ProductService, PrismaService], // <-- Добавляем PrismaService
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
