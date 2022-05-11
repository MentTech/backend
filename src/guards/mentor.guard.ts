import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class MentorGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user) return false;
    const mentorId: string = request.params.mentorId;
    return (
      user.role === Role.ADMIN ||
      (+mentorId === user.id && user.role === Role.MENTOR)
    );
  }
}
