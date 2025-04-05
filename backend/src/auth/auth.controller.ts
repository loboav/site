import { Body, Controller, Post, UseGuards, Req, Get, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service'; // Импортируем PrismaService

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService, // Добавляем PrismaService
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto, @Req() req) {
    return this.authService.register(dto, req.user);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('admins')
  async getAdmins() {
    const admins = await this.prisma.user.findMany({
      where: { role: 'admin' },
    });

    if (admins.length === 0) {
      // Если администраторов нет, создаем нового
      const defaultAdmin = {
        name: 'Default Admin',
        email: 'admin@myhoneyshop.com',
        password: 'admin123', // Пароль по умолчанию
        role: 'admin',
      };

      const hashedPassword = await this.authService.hashPassword(
        defaultAdmin.password,
      );

      await this.prisma.user.create({
        data: {
          name: defaultAdmin.name,
          email: defaultAdmin.email,
          password: hashedPassword,
          role: defaultAdmin.role,
        },
      });

      throw new BadRequestException(
        'Администратор отсутствовал. Создан новый администратор с email: admin@myhoneyshop.com и паролем: admin123',
      );
    }

    return admins;
  }
}
