import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';
import { MentorGuard } from './mentor.guard';

describe('MentorGuard', () => {
  let mentorGuard: MentorGuard;

  beforeEach(() => {
    mentorGuard = new MentorGuard();
  });

  it('should be defined', () => {
    expect(mentorGuard).toBeDefined();
  });

  it('should return true if mentorId is matched', () => {
    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({
      user: {
        id: 1,
        role: Role.MENTOR,
      },
      params: {
        mentorId: '1',
      },
    });
    expect(mentorGuard.canActivate(context)).toBe(true);
  });

  it('should return false if user is not auth', () => {
    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({
      user: undefined,
    });
    expect(mentorGuard.canActivate(context)).toBe(false);
  });
});
