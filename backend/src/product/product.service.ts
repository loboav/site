import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from 'src/product/dto/product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Только администратор может добавлять товары');
    }
    try {
      // Преобразуем price в число и добавляем stock, если отсутствует
      const data = {
        ...dto,
        price: parseFloat(dto.price.toString()),
        stock: dto.stock ?? 0, // Устанавливаем значение по умолчанию
      };
      return await this.prisma.product.create({ data });
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
      // Преобразуем price в число, если оно передано
      const data = {
        ...dto,
        price: dto.price ? parseFloat(dto.price.toString()) : undefined,
      };
      this.logger.log('Updating product with data:', data);
      return await this.prisma.product.update({ where: { id }, data });
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
