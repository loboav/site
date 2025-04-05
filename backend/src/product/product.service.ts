import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from 'src/product/dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Только администратор может добавлять товары');
    }
    try {
      return await this.prisma.product.create({ data: dto });
    } catch (error) {
      throw new Error(`Ошибка создания продукта: ${error.message}`);
    }
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Товар не найден');
    return product;
  }

  async update(id: string, dto: UpdateProductDto, userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Только администратор может редактировать товары');
    }
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException('Товар не найден');
      }
      return await this.prisma.product.update({ where: { id }, data: dto });
    } catch (error) {
      throw new Error(`Ошибка обновления продукта: ${error.message}`);
    }
  }

  async remove(id: string, userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Только администратор может удалять товары');
    }
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException('Товар не найден');
      }
      return await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      throw new Error(`Ошибка удаления продукта: ${error.message}`);
    }
  }
}
