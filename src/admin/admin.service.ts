import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async addAdmin(admin: CreateUserDto) {
    admin.password = await this.authService.createHashedPassword(
      admin.password,
    );
    return this.usersService.createUser(admin, Role.ADMIN);
  }
}
