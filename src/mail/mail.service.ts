import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async sendUserConfirmationEmail(user: User, token: string) {
    const web = this.config.get<string>('url.web');
    const url = `${web}/activation/${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirm your email',
      template: 'confirmation',
      context: {
        name: user.name,
        url,
      },
    });
  }

  async sendMentorConfirmationEmail(user: User, password: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Mentor application accepted',
      template: 'mentor-confirm',
      context: {
        name: user.name,
        email: user.email,
        password,
      },
    });
  }

  async sendMentorVerificationEmail(user: User, token: string) {
    const web = this.config.get<string>('url.web');
    const url = `${web}/register/mentor/verify/${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your identity',
      template: 'verify-mentor',
      context: {
        name: user.name,
        url,
      },
    });
    return url;
  }
}
