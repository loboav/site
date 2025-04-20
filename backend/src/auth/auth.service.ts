import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto, LoginDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { $Enums } from '@prisma/client';

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

    // Устанавливаем роль (по умолчанию 'user')
    let role: $Enums.Role = $Enums.Role.user;
    if (dto.role === 'admin') {
      // Только администраторы могут регистрировать администраторов
      if (!currentUser || currentUser.role !== 'admin') {
        throw new ForbiddenException('Only admins can create admins');
      }
      role = $Enums.Role.admin;
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role, // Устанавливаем роль через enum
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
    return { token, role: user.role }; // ✅ Теперь возвращаем и токен, и роль
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}