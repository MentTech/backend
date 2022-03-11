import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitMentorDto } from './dtos/submit-mentor.dto';

@Injectable()
export class MentorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async submitMentor(form: SubmitMentorDto) {
    const password = form.email + form.phone;
    const hashedPassword = await this.authService.createHashedPassword(
      password,
    );
    await this.prisma.user.create({
      data: {
        email: form.email,
        name: form.name,
        password: hashedPassword,
        birthday: form.birthday,
        phone: form.phone,
        avatar: form.avatar,
        role: Role.MENTOR,
        User_mentor: {
          create: {
            degree: form.degree,
            experiences: form.experiences,
            field: form.field,
            skills: {
              createMany: {
                data: form.skills.map((s) => ({ description: s })),
              },
            },
            jobs: {
              createMany: {
                data: form.jobs,
              },
            },
            achievements: {
              createMany: {
                data: form.achievements.map((a) => ({ description: a })),
              },
            },
            isAccepted: false,
            introduction: form.introduction,
          },
        },
      },
    });
    return 'Form submitted';
  }
}
