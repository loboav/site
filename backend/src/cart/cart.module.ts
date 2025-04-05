import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { PrismaService } from "../prisma/prisma.service";
import { AuthModule } from "../auth/auth.module"; // ✅ Добавлено

@Module({
  imports: [AuthModule], // ✅ Добавлено
  controllers: [CartController],
  providers: [CartService, PrismaService],
})
export class CartModule {}
