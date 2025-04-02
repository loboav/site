import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto, LoginDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(dto: RegisterDto, currentUser?: any) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Устанавливаем роль
    let role = dto.role || 'user';

    if (role === 'admin') {
      // Только администраторы могут регистрировать администраторов
      if (!currentUser || currentUser.role !== 'admin') {
        throw new ForbiddenException('Only admins can create admins');
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role, // Устанавливаем роль
        cart: { create: {} }, // Создаём корзину сразу при регистрации
      },
    });

    return { message: 'User registered successfully' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
    return { token };
  }
}
