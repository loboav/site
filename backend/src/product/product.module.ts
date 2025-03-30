import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // Импортируем AuthModule

@Module({
  imports: [PrismaModule, AuthModule], // Добавляем AuthModule
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
