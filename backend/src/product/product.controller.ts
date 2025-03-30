import { 
  Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, UnauthorizedException 
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from 'src/product/dto/product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateProductDto, @Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }
    return this.productService.create(dto, req.user['role']);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto, @Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }
    return this.productService.update(id, dto, req.user['role']);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }
    return this.productService.remove(id, req.user['role']);
  }
}
