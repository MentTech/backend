import { Test, TestingModule } from '@nestjs/testing';
import { MenteeService } from './mentee.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

let mockPrismaService = {};
let mockUsersService = {};

describe('MenteeService', () => {
  let service: MenteeService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenteeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<MenteeService>(MenteeService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
