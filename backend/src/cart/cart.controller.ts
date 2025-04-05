import { Controller, Post, Get, Delete, Body, Param, UseGuards, Req } from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post("add")
  async addToCart(@Req() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async removeFromCart(@Param("id") id: string) {
    return this.cartService.removeFromCart(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
