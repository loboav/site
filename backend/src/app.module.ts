import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [AuthModule, ProductModule, CartModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
