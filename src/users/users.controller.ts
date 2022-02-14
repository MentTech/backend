import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
  getProfile(@GetUser() user: User) {
    const res: ResponseDto = {
      success: true,
      message: 'Get profile success',
      data: plainToClass(UserDto, user),
    };
    return res;
  }
}
