import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let usersService: UsersService;
  let authService: AuthService;

  const user = {
    id: 1,
    email: 'admin@email.com',
    name: 'John',
    password: 'coihakcnoilnnk,aw',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(user),
          },
        },
        {
          provide: AuthService,
          useValue: {
            createHashedPassword: jest.fn().mockResolvedValue(user.password),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should created new admin', async () => {
    const admin = await service.addAdmin({
      email: 'admin@email.com',
      name: 'John',
      password: 'password',
    });
    expect(admin).toEqual(user);
    expect(authService.createHashedPassword).toHaveBeenCalledWith('password');
  });
});
