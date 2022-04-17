import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserQueryPaginationDto } from '../users/dtos/user-query-pagination.dto';
import { UpdateUserDto } from '../users/dtos/update-user.dto';

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
    return this.usersService.createUser(admin, Role.ADMIN, true);
  }

  getAdmins(query: UserQueryPaginationDto) {
    return this.usersService.findAll(query, Role.ADMIN);
  }

  async getAdminById(id: number) {
    const user = await this.usersService.findUserByIdAndRole(id, Role.ADMIN);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  updateAdmin(id: number, dto: UpdateUserDto) {
    return this.usersService.changeProfile(id, dto);
  }
}
