import { HttpService } from '@nestjs/axios';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
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
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    bcryptService = module.get<BcryptService>(BcryptService);
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
  });
});
