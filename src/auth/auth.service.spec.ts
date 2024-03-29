import { HttpService } from '@nestjs/axios';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { of, throwError } from 'rxjs';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { BcryptService } from './bcrypt.service';
import { ActivationService } from '../activation/activation.service';

const user = {
  id: 1,
  email: 'test@email.com',
  name: 'John',
  password: 'coihakcnoilnnk,aw',
  role: Role.MENTEE,
  isActive: true,
  birthday: new Date(),
  coin: 0,
  avatar: '',
  createAt: new Date(),
  phone: '123',
};

const mockActivationService = {
  sendActivationEmail: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let bcryptService: BcryptService;
  let httpService: HttpService;
  let activationService: ActivationService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(user),
            findByEmail: jest.fn().mockResolvedValue(user),
            changePassword: jest.fn().mockResolvedValue(user),
            findById: jest.fn().mockResolvedValue(user),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
            decode: jest.fn().mockReturnValue({
              id: 1,
            }),
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
        {
          provide: ActivationService,
          useValue: mockActivationService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    bcryptService = module.get<BcryptService>(BcryptService);
    httpService = module.get<HttpService>(HttpService);
    activationService = module.get<ActivationService>(ActivationService);
    jwtService = module.get<JwtService>(JwtService);
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
      const userR = await service.signUp(credentials, true);
      expect(userR).toEqual(userR);
      expect(spy).toHaveBeenCalledWith(credentials.password);
    });

    it('should throw error if email is exist', async () => {
      jest
        .spyOn(usersService, 'createUser')
        .mockRejectedValue(new Error('email already exists'));
      const credentials = {
        email: 'test@email.com',
        password: 'password',
        name: 'John',
      };
      await expect(service.signUp(credentials, true)).rejects.toThrow(
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
      jest.spyOn(bcryptService, 'compare').mockResolvedValue(false);
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
        isPasswordSet: true,
      });
      usersService.findByEmail = jest.fn().mockResolvedValue(null);
      const req = await service.logInByEmail(user.email, user.name);
      expect(req.accessToken).toEqual('token');
      expect(usersService.findByEmail).toHaveBeenCalledWith(user.email);
    });

    it('should sign in if user log in by google', async () => {
      const token = 'token';
      jest.spyOn(service, 'logInByEmail').mockImplementation(() =>
        Promise.resolve({
          accessToken: token,
        }),
      );
      const data = await service.googleTokenLogin(token);
      expect(data.accessToken).toEqual('token');
      expect(service.logInByEmail).toBeCalled();
    });

    it('should throw error if google token is invalid', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => new Error('invalid token')));
      await expect(service.googleTokenLogin('token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should sign in if user log in by facebook', async () => {
      const token = 'token';
      jest.spyOn(service, 'logInByEmail').mockImplementation(() =>
        Promise.resolve({
          accessToken: token,
        }),
      );
      const data = await service.facebookTokenLogin(token);
      expect(data.accessToken).toEqual('token');
      expect(service.logInByEmail).toBeCalled();
    });

    it('should throw error if facebook token is invalid', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => new Error('invalid token')));
      await expect(service.facebookTokenLogin('token')).rejects.toThrow(
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

  it('should change user password', async () => {
    const spy = jest
      .spyOn(bcryptService, 'hash')
      .mockResolvedValue('hashedPassword');
    const u = await service.changePassword(user.id, 'password', 'newPassword');
    expect(u).toEqual('Password changed successfully');
    expect(spy).toHaveBeenCalledWith('newPassword');
  });

  it('should throw error if old password is wrong', async () => {
    jest.spyOn(bcryptService, 'compare').mockResolvedValue(false);
    await expect(
      service.changePassword(user.id, 'password', 'newPassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  describe('SetPassword', () => {
    it('should set password', async () => {
      jest.spyOn(bcryptService, 'hash').mockResolvedValue('hashedPassword');
      const u = await service.setPassword(user.id, 'password');
      expect(u.id).toEqual(1);
    });

    it('should throw error if user is not exist', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(null);
      await expect(service.setPassword(2, 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw error if password is already set', async () => {
      jest
        .spyOn(usersService, 'findById')
        .mockResolvedValue({ ...user, isPasswordSet: true });
      await expect(service.setPassword(user.id, 'password')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('validateJwtToken', () => {
    it('should return user if token is valid', async () => {
      const u = await service.validateJwtToken('123123123123123');
      expect(u).toEqual(user);
    });

    it('should throw error if token is invalid', async () => {
      jest.spyOn(jwtService, 'decode').mockReturnValue(null);
      const ret = await service.validateJwtToken('123123123123123');
      expect(ret).toEqual(null);
    });
  });
});
