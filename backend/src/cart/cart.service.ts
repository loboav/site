import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AddToCartDto } from "../cart/dto/add-to-cart.dto";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Добавить товар в корзину
  async addToCart(userId: string, dto: AddToCartDto) {
    const { productId, quantity } = dto;

    console.log("Добавление в корзину:", { userId, productId, quantity }); // Логируем входные данные

    if (quantity === 0) {
      throw new Error("Количество не может быть равно нулю");
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.error("Продукт не найден:", productId); // Логируем ошибку
      throw new NotFoundException("Товар не найден");
    }

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + quantity;
      if (updatedQuantity <= 0) {
        console.log("Удаление товара из корзины:", { cartItemId: existingItem.id });
        return await this.prisma.cartItem.delete({
          where: { id: existingItem.id },
        });
      }
      return await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: updatedQuantity },
      });
    } else {
      if (quantity < 0) {
        throw new Error("Невозможно уменьшить количество товара, которого нет в корзине");
      }
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
