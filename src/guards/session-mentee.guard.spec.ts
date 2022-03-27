import { SessionMenteeGuard } from './session-mentee.guard';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  programRegister: {
    findFirst: jest.fn().mockResolvedValue({
      id: 1,
    }),
  },
};

describe('SessionMenteeGuard', () => {
  let guard: SessionMenteeGuard;

  beforeEach(() => {
    guard = new SessionMenteeGuard(
      mockPrismaService as unknown as PrismaService,
    );
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
