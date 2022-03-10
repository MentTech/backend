import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../decorators/get-user.decorator';
import { UserDto } from '../dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Serialize(UserDto)
  @UseGuards(AuthGuard())
  @Get('/profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'get profile success',
  })
  getProfile(@GetUser() user: User) {
    return user;
  }

  @Patch('/profile')
  @UseGuards(AuthGuard())
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Change user profile' })
  @ApiResponse({
    status: 200,
    description: 'Change success',
  })
  updateProfile(@GetUser() user: User, @Body() userDto: UpdateUserDto) {
    return this.usersService.changeProfile(user.id, userDto);
  }
}
