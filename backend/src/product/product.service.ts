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
      // Преобразуем price и stock в числа
      const data = {
        ...dto,
        price: parseFloat(dto.price.toString()),
        stock: parseInt(dto.stock.toString(), 10) || 0, // Устанавливаем значение по умолчанию
        categoryId: dto.categoryId, // обязательно
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
      // Преобразуем price и stock в числа, если они переданы
      const data = {
        ...dto,
        price: dto.price ? parseFloat(dto.price.toString()) : undefined,
        stock: dto.stock ? parseInt(dto.stock.toString(), 10) : undefined,
        categoryId: dto.categoryId,
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
      // Всё в одной транзакции!
      await this.prisma.$transaction([
        this.prisma.cartItem.deleteMany({ where: { productId: id } }),
        this.prisma.product.delete({ where: { id } }),
      ]);
      return { message: 'Товар и связанные позиции в корзинах удалены' };
    } catch (error) {
      throw new Error(`Ошибка удаления продукта: ${error.message}`);
    }
  }
}
