import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { CredentialDto } from './dtos/credential.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() credentialDto: CreateUserDto) {
    return this.authService.signUp(credentialDto);
  }

  @Post('signin')
  signIn(@Body() credentialDto: CredentialDto) {
    return this.authService.signIn(credentialDto);
  }
}
