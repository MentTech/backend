import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserDto } from '../dtos/user.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiForbiddenResponse({
  description: 'Forbidden',
})
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Serialize(UserDto)
  @Post('/')
  @ApiCreatedResponse({
    description: 'New admin created',
  })
  addAdmin(@Body() admin: CreateUserDto) {
    return this.adminService.addAdmin(admin);
  }
}
