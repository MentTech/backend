import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { GetUser } from '../../decorators/get-user.decorator';
import { ResponseDto } from '../../dtos/response.dto';
import { UserDto } from '../../dtos/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard())
  @Get('/profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'get profile success',
  })
  getProfile(@GetUser() user: User) {
    const res: ResponseDto = {
      success: true,
      message: 'Get profile success',
      data: plainToClass(UserDto, user),
    };
    return res;
  }
}
