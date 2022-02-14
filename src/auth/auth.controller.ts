import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { ResponseDto } from '../../dtos/response.dto';
import { UserDto } from '../../dtos/user.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { CredentialDto } from './dtos/credential.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async signUp(@Body() credentialDto: CreateUserDto) {
    const user = plainToClass(
      UserDto,
      await this.authService.signUp(credentialDto),
    );
    const userRes: ResponseDto = {
      success: true,
      message: 'Sign up success',
      data: user,
    };
    return userRes;
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({
    status: 201,
    description: 'Log in success, return access token',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Wrong password or user does not exist',
  })
  async signIn(@Body() credentialDto: CredentialDto) {
    return {
      success: true,
      message: 'log in success',
      data: await this.authService.signIn(credentialDto),
    };
  }
}
