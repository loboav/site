import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Только администратор может добавлять товары');
    }
    return this.prisma.product.create({ data: dto });
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
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Только администратор может редактировать товары');
    }
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Только администратор может удалять товары');
    }
    return this.prisma.product.delete({ where: { id } });
  }
}
