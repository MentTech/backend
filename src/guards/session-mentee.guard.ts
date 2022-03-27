import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionMenteeGuard implements CanActivate {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const sessionId: string = request.params.sessionId;

    return this.validate(user, +sessionId);
  }

  async validate(user: User, sessionId: number): Promise<boolean> {
    const session = await this.prisma.programRegister.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
        isAccepted: true,
        done: true,
      },
    });
    if (!session) {
      return false;
    }
    return true;
  }
}
