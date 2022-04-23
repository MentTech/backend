import {
  ConflictException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { nanoid } from 'nanoid';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ActivationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async sendActivationEmail(user: User) {
    const existToken = await this.prisma.activationCode.findFirst({
      where: {
        userId: user.id,
      },
    });
    if (existToken) {
      if (existToken.isUsed) {
        throw new ConflictException('Activation code is already used');
      }
      await this.prisma.activationCode.delete({
        where: {
          id: existToken.id,
        },
      });
    }
    const newToken = nanoid();
    await this.prisma.activationCode.create({
      data: {
        userId: user.id,
        code: newToken,
      },
    });
    await this.mailService.sendUserConfirmationEmail(user, newToken);
    return {
      message: 'Activation code sent to your email',
    };
  }

  async resendActivationEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.sendActivationEmail(user);
  }

  async activateAccount(token: string) {
    const activationCode = await this.prisma.activationCode.findFirst({
      where: {
        code: token,
      },
    });
    if (!activationCode) {
      throw new NotFoundException('Activation code is not valid');
    }
    if (activationCode.isUsed) {
      throw new ConflictException('Activation code is already used');
    }
    const now = new Date();
    const expirationDate = new Date(
      activationCode.createAt.getTime() + 1000 * activationCode.expiredIn,
    );
    if (expirationDate > now) {
      throw new GoneException('Activation code is expired');
    }
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          id: activationCode.userId,
        },
        data: {
          isActive: true,
        },
      }),
      this.prisma.activationCode.update({
        where: {
          id: activationCode.id,
        },
        data: {
          isUsed: true,
        },
      }),
    ]);
    return {
      message: 'Account activated',
    };
  }
}
