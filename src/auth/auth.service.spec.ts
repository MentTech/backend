import { HttpService } from '@nestjs/axios';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { of, throwError } from 'rxjs';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { BcryptService } from './bcrypt.service';

const user = {
  id: 1,
  email: 'test@email.com',
  name: 'John',
  password: 'coihakcnoilnnk,aw',
  role: Role.MENTEE,
  isActive: true,
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let bcryptService: BcryptService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(user),
            findByEmail: jest.fn().mockResolvedValue(user),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
        {
          provide: BcryptService,
          useValue: {
            hash: jest.fn().mockResolvedValue('hashedPassword'),
            compare: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest
              .fn()
              .mockReturnValue(
                of({ data: { email: user.email, name: user.name } }),
              ),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    bcryptService = module.get<BcryptService>(BcryptService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash password', async () => {
    const password = 'password';
    const hashedPassword = await service.createHashedPassword(password);
    expect(password).not.toEqual(hashedPassword);
  });

  describe('SignUp', () => {
    it('should register new user', async () => {
      const spy = jest
        .spyOn(service, 'createHashedPassword')
        .mockResolvedValue(user.password);
      const credentials = {
        email: 'test@email.com',
        password: 'password',
        name: 'John',
      };
      const userR = await service.signUp(credentials);
      expect(userR).toEqual(userR);
      expect(spy).toHaveBeenCalledWith(credentials.password);
    });

    it('should throw error if email is exist', async () => {
      const spy1 = jest
        .spyOn(usersService, 'createUser')
        .mockRejectedValue(new Error('email already exists'));
      const credentials = {
        email: 'test@email.com',
        password: 'password',
        name: 'John',
      };
      await expect(service.signUp(credentials)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('SignIn', () => {
    it('should sign user in and return access token', async () => {
      const credential = {
        email: 'test@email.com',
        password: 'password',
      };
      const token = await service.signIn(credential, Role.MENTEE);
      expect(token.accessToken).toEqual('token');
    });

    it('should throw error if user not exist', async () => {
      const spy1 = jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(null);
      const credential = {
        email: 'test1@email.com',
        password: 'password1',
      };
      expect(service.signIn(credential, Role.MENTEE)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(spy1).toHaveBeenCalledWith(credential.email);
    });

    it('should throw error if password is not matched', async () => {
      usersService.findByEmail = jest.fn().mockResolvedValue(user);
      const spy2 = jest
        .spyOn(bcryptService, 'compare')
        .mockResolvedValue(false);
      const credential = {
        email: 'test1@email.com',
        password: 'password1',
      };
      expect(service.signIn(credential, Role.MENTEE)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should sign user in if user log in by email', async () => {
      const email = 'test@email.com';
      const req = await service.logInByEmail(email, 'John');
      expect(req.accessToken).toEqual('token');
    });

    it('should create new account if email is not exist', async () => {
      jest.spyOn(service, 'signUp').mockResolvedValue({
        ...user,
        password: 'hashedPassword',
        birthday: new Date(),
        phone: '+380937777777',
        avatar: '',
        coin: 0,
        createAt: new Date(),
      });
      usersService.findByEmail = jest.fn().mockResolvedValue(null);
      const req = await service.logInByEmail(user.email, user.name);
      expect(req.accessToken).toEqual('token');
      expect(usersService.findByEmail).toHaveBeenCalledWith(user.email);
    });

    it('should sign in if user log in by google', async () => {
      const token = 'token';
      const spy10 = jest.spyOn(service, 'logInByEmail').mockImplementation(() =>
        Promise.resolve({
          accessToken: token,
        }),
      );
      const data = await service.googleTokenLogin(token);
      expect(data.accessToken).toEqual('token');
      expect(service.logInByEmail).toBeCalledWith(user.email, user.name);
    });

    it('should throw error if google token is invalid', async () => {
      const spy11 = jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(new Error('invalid token')));
      await expect(service.googleTokenLogin('token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  it('should return user if user is auth', () => {
    const req = { user };
    const u = service.googleLogin(req);
    const uR = u as { user: any };
    expect(uR.user).toEqual(user);
  });

  it('should return "No user" if user is unauth', () => {
    const req = {};
    const u = service.googleLogin(req);
    expect(u).toEqual('No user');
  });
});
