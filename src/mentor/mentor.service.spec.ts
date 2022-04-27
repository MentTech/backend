import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitMentorDto } from './dtos/submit-mentor.dto';
import { MentorService } from './mentor.service';
import { SortOrder } from './dtos/search-mentor.dto';

const form: SubmitMentorDto = {
  email: 'test@email.com',
  name: 'test',
  birthday: '2020-01-01',
  phone: '123456789',
  avatar: 'avatar',
  degree: [
    {
      title: 'test',
      issuer: 'test',
      description: 'test',
      startAt: '2020-01-01',
    },
  ],
  experiences: [
    {
      title: 'test',
      description: 'test',
      company: 'test',
      startAt: '2020-01-01',
    },
  ],
  categoryId: 1,
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
    skills: [],
  },
};

const singleRating = {
  id: 1,
  rating: 5,
  comment: 'comment',
};

const mockPrismaService = {
  user: {
    create: jest.fn().mockResolvedValue(mentorR),
    findMany: jest.fn().mockResolvedValue([mentorR]),
    update: jest.fn().mockReturnValue(mentorR),
    findFirst: jest.fn().mockResolvedValue(mentorR),
    count: jest.fn().mockResolvedValue(1),
  },
  rating: {
    count: jest.fn().mockResolvedValue(10),
    findMany: jest.fn().mockResolvedValue([singleRating]),
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

  it('should search for mentor', async () => {
    prisma.user.findMany = jest.fn().mockResolvedValue([mentorR]);
    await service.searchMentor({
      category: 1,
      skills: [1],
      orderBy: 'name',
      order: SortOrder.ASC,
      page: 1,
      limit: 10,
    });
    expect(prisma.user.findMany).toBeCalled();
  });

  describe('Get mentor by id', () => {
    it('should get mentor by id', async () => {
      const mentor = await service.getMentor(1);
      expect(mentor).toEqual(mentorR);
      expect(prisma.user.findFirst).toBeCalled();
    });

    it('should throw error if mentor is not exist', async () => {
      prisma.user.findFirst = jest.fn().mockResolvedValue(null);
      await expect(service.getMentor(1)).rejects.toThrow(NotFoundException);
      expect(prisma.user.findFirst).toBeCalled();
    });
  });

  it('should get mentor rating', async () => {
    const query = {
      page: 1,
      limit: 10,
    };
    const rating = await service.getAllRating(1, query);
    expect(rating).toEqual({
      page: 1,
      totalPage: 1,
      limit: 10,
      data: [singleRating],
    });
    expect(prisma.rating.count).toBeCalled();
  });
});
