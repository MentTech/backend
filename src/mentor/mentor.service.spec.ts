import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitMentorDto } from './dtos/submit-mentor.dto';
import { MentorService } from './mentor.service';

const form: SubmitMentorDto = {
  email: 'test@email.com',
  name: 'test',
  birthday: '2020-01-01',
  phone: '123456789',
  avatar: 'avatar',
  degree: ['degree'],
  experiences: ['experiences'],
  categoryId: 1,
  jobs: [
    {
      position: 'title',
      company: 'company',
    },
  ],
  skillIds: [1],
  achievements: ['achievement'],
  introduction: 'introduction',
};

const mentorR = {
  id: 1,
  email: form.email,
  name: form.name,
  password: 'hashedPassword',
  birthday: form.birthday,
  phone: form.phone,
  avatar: form.avatar,
  role: Role.MENTOR,
  isActive: false,
  User_mentor: {
    degree: form.degree,
    experiences: form.experiences,
    category: {
      id: form.categoryId,
      name: 'category',
    },
  },
};

const mockPrismaService = {
  user: {
    create: jest.fn().mockResolvedValue(mentorR),
    findMany: jest.fn().mockResolvedValue([mentorR]),
    update: jest.fn().mockReturnValue(mentorR),
    findFirst: jest.fn().mockResolvedValue(mentorR),
  },
};
const mockAuthService = {
  createHashedPassword: jest.fn().mockResolvedValue('hashedPassword'),
};

describe('MentorService', () => {
  let service: MentorService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MentorService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<MentorService>(MentorService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should submit mentor applicatio form', async () => {
    const success = await service.submitMentor(form);
    expect(success).toEqual('Form submitted');
    expect(prisma.user.create).toBeCalled();
  });

  it('should return all mentor', async () => {
    const mentors = await service.getMentors(false);
    expect(mentors[0]).not.toHaveProperty('password');
    expect(prisma.user.findMany).toBeCalled();
  });

  it('should accept mentor', async () => {
    const mentor = await service.acceptMentor(1);
    expect(mentor).toEqual(mentorR);
    expect(prisma.user.update).toBeCalled();
  });
});
