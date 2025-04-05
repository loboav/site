import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AddToCartDto } from "../cart/dto/add-to-cart.dto";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Добавить товар в корзину
  async addToCart(userId: string, dto: AddToCartDto) {
    const { productId, quantity } = dto;

    // Проверяем, существует ли корзина
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true }, // Теперь items точно есть
    });

    // Если корзины нет — создаем
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: true }, // Указываем, что хотим вернуть items
      });
    }

    if (!cart?.id) {
      throw new NotFoundException("Ошибка создания корзины");
    }

    // Проверяем, есть ли товар в корзине
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      // Если товар уже в корзине, обновляем количество
      return await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Если товара нет, добавляем
      return await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
  }

  // Получить содержимое корзины
  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException("Корзина не найдена");
    }

    return cart;
  }

  // Удалить товар из корзины
  async removeFromCart(cartItemId: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException("Товар в корзине не найден");
    }

    return await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  // Очистить корзину
  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException("Корзина не найдена");
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { message: "Корзина очищена" };
  }
}
