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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { GetUser } from '../decorators/get-user.decorator';
import { UserDto } from '../dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { CredentialDto } from './dtos/credential.dto';
import JwtAuthenticationGuard from './guards/jwt-authentiacation.guard';

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

  @Post('/google/token')
  @ApiOperation({ summary: 'log in with google token' })
  googleTokenLogin(@Query('token') token: string) {
    return this.authService.googleTokenLogin(token);
  }

  @Post('/facebook/token')
  @ApiOperation({ summary: 'log in with facebook token' })
  facebookTokenLogin(@Query('token') token: string) {
    return this.authService.facebookTokenLogin(token);
  }

  @Post('/signIn/admin')
  @ApiOperation({ summary: 'Admin sign in' })
  adminSignIn(@Body() credential: CredentialDto) {
    return this.authService.signIn(credential, Role.ADMIN);
  }

  @Post('signIn/mentor')
  @ApiOperation({ summary: 'Mentor sign in' })
  mentorSignIn(@Body() credential: CredentialDto) {
    return this.authService.signIn(credential, Role.MENTOR);
  }

  @Post('/changepassword')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Change password' })
  @ApiBearerAuth()
  changePassword(@Body() body: ChangePasswordDto, @GetUser() user: User) {
    return this.authService.changePassword(
      user.id,
      body.oldPassword,
      body.newPassword,
    );
  }
}
