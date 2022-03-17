import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { RolesGuard } from './roles.guard';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';

const mockReflector: Partial<Reflector> = {
  getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN]),
};

describe('RolesGuard', () => {
  let guard: RolesGuard;
  beforeEach(() => {
    guard = new RolesGuard(mockReflector as Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true with auth', () => {
    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({
      user: {
        id: 1,
        role: Role.ADMIN,
      },
    });
    expect(guard.canActivate(context)).toBe(true);
    expect(context.switchToHttp().getRequest).toHaveBeenCalled();
  });

  it('should return false if role is not matched', () => {
    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({
      user: {
        id: 1,
        role: Role.MENTOR,
      },
    });
    expect(guard.canActivate(context)).toBe(false);
    expect(context.switchToHttp().getRequest).toHaveBeenCalled();
  });

  it('should return false if user is not log in', () => {
    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({
      user: undefined,
    });
    expect(guard.canActivate(context)).toBe(false);
    expect(context.switchToHttp().getRequest).toHaveBeenCalled();
  });
});
