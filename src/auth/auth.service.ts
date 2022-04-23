import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { randomBytes } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { BcryptService } from './bcrypt.service';
import { CredentialDto } from './dtos/credential.dto';
import { JwtPayload } from './dtos/jwt-payload.dto';
import { ActivationService } from '../activation/activation.service';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly httpService: HttpService,
    private readonly activationService: ActivationService,
  ) {}

  async createHashedPassword(password: string) {
    return this.bcryptService.hash(password);
  }

  async signUp(credentials: CreateUserDto, isPasswordSet: boolean) {
    const { password } = credentials;

    const hashedPassword = await this.createHashedPassword(password);
    const newUser: CreateUserDto = {
      ...credentials,
      password: hashedPassword,
    };
    try {
      const user = await this.usersService.createUser(
        newUser,
        Role.MENTEE,
        isPasswordSet,
      );
      await this.activationService.sendActivationEmail(user);
      return user;
    } catch (err) {
      this.logger.error(err);
      throw new ConflictException('email already exists');
    }
  }

  async setPassword(userId: number, password: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.isPasswordSet) {
      throw new ConflictException('password already set');
    }
    const hashedPassword = await this.createHashedPassword(password);
    return this.usersService.changePassword(userId, hashedPassword);
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
      return this.logInByEmail(data.email, data.name, data.picture);
    } catch (e) {
      throw new UnauthorizedException('Please check your login credential');
    }
  }

  async facebookTokenLogin(accessToken: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `https://graph.facebook.com/me?fields=name,email,picture&access_token=${accessToken}`,
        ),
      );
      return this.logInByEmail(data.email, data.name);
    } catch (e) {
      throw new UnauthorizedException('Please check your login credential');
    }
  }

  async logInByEmail(email: string, name: string, avatar?: string) {
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.signUp(
        {
          email: email,
          password: randomBytes(16).toString('hex'),
          name: name,
          avatar,
        },
        false,
      );
    }
    const payload: JwtPayload = { id: user.id };
    const jwt = this.jwtService.sign(payload);
    return { accessToken: jwt };
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findById(userId);
    if (
      user &&
      (await this.bcryptService.compare(oldPassword, user.password)) &&
      user.isActive
    ) {
      const hashedPassword = await this.createHashedPassword(newPassword);
      await this.usersService.changePassword(user.id, hashedPassword);
      return 'Password changed successfully';
    } else {
      throw new UnauthorizedException('Please check your old password');
    }
  }

  async validateJwtToken(token: string) {
    const jwtPayload = this.jwtService.decode(token) as JwtPayload;
    if (jwtPayload) {
      const user = await this.usersService.findById(jwtPayload.id);
      if (user) {
        return user;
      }
    }
    return null;
  }
}
