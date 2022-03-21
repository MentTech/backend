import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

const singleUser = {
  id: 1,
  email: 'test@gmail.com',
  password: 'test',
  name: 'test',
  role: Role.MENTEE,
};

const users = [
  {
    id: 1,
    email: 'test@gmail.com',
    password: 'test',
    name: 'test',
    role: Role.MENTEE,
  },
  {
    id: 2,
    email: 'test1@gmail.com',
    password: 'test1',
    name: 'test1',
    role: Role.MENTEE,
  },
  {
    id: 3,
    email: 'test2@gmail.com',
    password: 'test2',
    name: 'test2',
    role: Role.MENTEE,
  },
];

const db = {
  user: {
    create: jest.fn().mockResolvedValue(singleUser),
    findUnique: jest.fn().mockResolvedValue(singleUser),
    findMany: jest.fn().mockResolvedValue(users),
    update: jest.fn().mockResolvedValue(users[1]),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create user', () => {
    it('should create new user', async () => {
      const user = await service.createUser(
        {
          email: 'test@email.com',
          password: 'test',
          name: 'test',
        },
        Role.MENTEE,
      );
      expect(user).toEqual(singleUser);
    });

    it('should throw email exist error', async () => {
      jest
          .spyOn(prisma.user, 'create')
          .mockRejectedValue(new Error('Email is already exist'));
      await expect(
          service.createUser(
              {email: 'test@email.com', password: 'test', name: 'test'},
              Role.MENTEE,
          ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  it('should return user with match id', async () => {
    const user = await service.findById(1);
    expect(user).toEqual(singleUser);
  });

  it('should return all users', async () => {
    const users = await service.findAll();
    expect(users).toEqual(users);
  });

  it('should return user with match email', async () => {
    const user = await service.findByEmail('test@email.com');
    expect(user).toEqual(singleUser);
  });

  it('should update user', async () => {
    const user = await service.changeProfile(1, {
      email: 'test1@email.com',
      name: 'test1',
    });
    expect(user).toEqual(users[1]);
  });

  it('should change user password', async () => {
    const user = await service.changePassword(1, 'test1');
    expect(user).toEqual(users[1]);
  });
});
