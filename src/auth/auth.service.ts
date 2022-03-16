import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { BcryptService } from './bcrypt.service';
import { CredentialDto } from './dtos/credential.dto';
import { JwtPayload } from './dtos/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly httpService: HttpService,
  ) {}
  async createHashedPassword(password: string) {
    return this.bcryptService.hash(password);
  }

  async signUp(credentials: CreateUserDto) {
    const { password } = credentials;

    const hashedPassword = await this.createHashedPassword(password);
    const newUser: CreateUserDto = {
      email: credentials.email,
      password: hashedPassword,
      name: credentials.name,
    };
    try {
      const user = await this.usersService.createUser(newUser, Role.MENTEE);
      return user;
    } catch (err) {
      throw new ConflictException('email already exists');
    }
  }

  async signIn(credential: CredentialDto, role: Role) {
    const { email, password } = credential;
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      (await this.bcryptService.compare(password, user.password)) &&
      user.role === role &&
      user.isActive
    ) {
      const payload: JwtPayload = { id: user.id };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credential');
    }
  }

  googleLogin(req: any) {
    if (!req.user) {
      return 'No user';
    }
    return {
      user: req.user,
    };
  }

  async googleTokenLogin(accessToken: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
        ),
      );
      return this.logInByEmail(data.email, data.name);
    } catch (e) {
      return new UnauthorizedException('Please check your login credential');
    }
  }

  async logInByEmail(email: string, name: string) {
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.signUp({
        email: email,
        password: randomBytes(16).toString('hex'),
        name: name,
      });
    }
    const payload: JwtPayload = { id: user.id };
    const jwt = this.jwtService.sign(payload);
    return { accessToken: jwt };
  }
}
