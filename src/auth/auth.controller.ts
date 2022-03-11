import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UserDto } from '../dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
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
  @ApiOperation({ summary: 'Mentee sign in' })
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
    return this.authService.signIn(credentialDto, Role.MENTEE);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('/google/token')
  googleTokenLogin(@Query('token') token: string) {
    return this.authService.googleTokenLogin(token);
  }
}
