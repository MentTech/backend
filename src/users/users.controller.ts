import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { UserDto } from '../dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Serialize(UserDto)
  @UseGuards(JwtAuthenticationGuard)
  @Get('/profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'get profile success',
  })
  @ApiHeader({
    name: 'Bearer',
    description: 'Authentication',
  })
  getProfile(@GetUser() user: User) {
    return user;
  }

  @Patch('/profile')
  @UseGuards(JwtAuthenticationGuard)
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Change user profile' })
  @ApiResponse({
    status: 200,
    description: 'Change success',
  })
  updateProfile(@GetUser() user: User, @Body() userDto: UpdateUserDto) {
    return this.usersService.changeProfile(user.id, userDto);
  }

  @Patch('/:id/lock')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lock user (ADMIN)' })
  lockUser(@Param('id') id: string) {
    return this.usersService.lockUser(+id);
  }
}
