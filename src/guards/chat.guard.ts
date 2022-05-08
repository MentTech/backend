import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ChatGuard implements CanActivate {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private readonly logger = new Logger('ChatGuard');

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const roomId: string = request.params.roomId;
    this.logger.verbose(`Checking if user is in room ${roomId}`);
    const user: User = request.user;
    if (!user || !roomId) {
      return false;
    }
    return this.validate(+roomId, user.id);
  }

  async validate(roomId: number, userId: number): Promise<boolean> {
    const room = await this.prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        participants: {
          some: {
            id: userId,
          },
        },
      },
    });
    return Boolean(room);
  }
}
