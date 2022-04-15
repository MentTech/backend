import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
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
import { UserQueryPaginationDto } from '../users/dtos/user-query-pagination.dto';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';
import { UpdateUserDto } from '../users/dtos/update-user.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiForbiddenResponse({
  description: 'Forbidden',
})
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Serialize(UserDto)
  @Post('/')
  @ApiCreatedResponse({
    description: 'New admin created',
  })
  @ApiOperation({ summary: 'add new admin' })
  addAdmin(@Body() admin: CreateUserDto) {
    return this.adminService.addAdmin(admin);
  }

  @Get('/')
  @ApiOperation({ summary: 'get all admins' })
  @ApiResponse({
    status: 200,
    description: 'The found admins',
    type: PaginationResponseDto,
  })
  getAdmins(@Query() query: UserQueryPaginationDto) {
    return this.adminService.getAdmins(query);
  }

  @Patch('/:id')
  @Serialize(UserDto)
  @ApiOperation({ summary: 'update admin' })
  @ApiResponse({
    status: 200,
    description: 'The updated admin',
    type: UserDto,
  })
  updateAdmin(@Body() admin: UpdateUserDto, @Param('id') id: string) {
    return this.adminService.updateAdmin(+id, admin);
  }
}
