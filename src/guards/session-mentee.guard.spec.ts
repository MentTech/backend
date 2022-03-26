import { SessionMenteeGuard } from './session-mentee.guard';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService: Partial<PrismaService> = {};

describe('SessionMenteeGuard', () => {
  let guard: SessionMenteeGuard;

  beforeEach(() => {
    guard = new SessionMenteeGuard(mockPrismaService as PrismaService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
