import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { compare, genSalt, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { CredentialDto } from './dtos/credential.dto';
import { JwtPayload } from './dtos/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(credentials: CreateUserDto) {
    const { password } = credentials;

    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    const newUser: CreateUserDto = {
      email: credentials.email,
      password: hashedPassword,
      name: credentials.name,
    };
    try {
      const user = await this.usersService.createUser(newUser);
      return user;
    } catch (err) {
      throw new ConflictException('email already exists');
    }
  }

  async signIn(credential: CredentialDto) {
    const { email, password } = credential;
    const user = await this.usersService.findByEmail(email);
    if (user && (await compare(password, user.password))) {
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
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
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
