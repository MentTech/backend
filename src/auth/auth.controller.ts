import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { ResponseDto } from '../../dtos/response.dto';
import { UserDto } from '../../dtos/user.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { CredentialDto } from './dtos/credential.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(UserDto)
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
  signUp(@Body() credentialDto: CreateUserDto) {
    return this.authService.signUp(credentialDto);
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
  signIn(@Body() credentialDto: CredentialDto) {
    return this.authService.signIn(credentialDto);
  }
}
