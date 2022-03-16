import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { SkillService } from './skill.service';

const singleSkill = {
  id: 1,
  description: 'test',
};

const singleSkill2 = {
  id: 1,
  description: 'test2',
};

const skillArray = [
  {
    id: 1,
    description: 'test',
  },
  {
    id: 2,
    description: 'test2',
  },
  {
    id: 3,
    description: 'test3',
  },
];

const db = {
  skill: {
    findMany: jest.fn().mockResolvedValue(skillArray),
    findUnique: jest.fn().mockResolvedValue(singleSkill),
    create: jest.fn().mockResolvedValue(singleSkill),
    update: jest.fn().mockResolvedValue(singleSkill2),
    delete: jest.fn().mockResolvedValue(singleSkill),
  },
};

describe('SkillService', () => {
  let service: SkillService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<SkillService>(SkillService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new skill', async () => {
    const skill = await service.create({
      description: 'test',
    });
    expect(skill.description).toEqual('test');
    expect(skill.id).toEqual(1);
  });

  it('should return all skill in db', async () => {
    const skills = await service.findAll();
    expect(skills.length).toEqual(3);
  });

  it('should return one skill', async () => {
    const skill = await service.findOne(1);
    expect(skill.description).toEqual('test');
    expect(skill.id).toEqual(1);
  });

  it('should update skill', async () => {
    const skill = await service.update(1, {
      description: 'test2',
    });
    expect(skill.description).toEqual('test2');
    expect(skill.id).toEqual(1);
  });

  it('should delete skill', async () => {
    const skill = await service.remove(1);
    expect(skill.description).toEqual('test');
    expect(skill.id).toEqual(1);
  });
});
