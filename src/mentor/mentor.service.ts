import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitMentorDto } from './dtos/submit-mentor.dto';
import * as _ from 'lodash';

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
        isActive: false,
        User_mentor: {
          create: {
            degree: form.degree,
            experiences: form.experiences,
            category: {
              connect: { id: form.categoryId },
            },
            jobs: {
              createMany: {
                data: form.jobs,
              },
            },
            skills: {
              create: form.skillIds.map((skillId) => ({
                skill: { connect: { id: skillId } },
              })),
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

  async getMentors(pending: boolean) {
    const users = await this.prisma.user.findMany({
      where: {
        AND: {
          role: Role.MENTOR,
          isActive: pending ? false : undefined,
          User_mentor: {
            isAccepted: pending ? false : undefined,
          },
        },
      },
      include: {
        User_mentor: {
          include: {
            jobs: true,
            achievements: true,
            skills: true,
          },
        },
      },
    });
    return users.map((user) => _.omit(user, 'password'));
  }

  async acceptMentor(id: number) {
    const mentor = await this.prisma.user.findFirst({
      where: {
        id,
        role: Role.MENTOR,
        isActive: false,
        User_mentor: { isAccepted: false },
      },
      include: { User_mentor: true },
    });
    if (!mentor) {
      throw new NotFoundException('Application not found');
    }
    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: true,
        User_mentor: {
          update: {
            isAccepted: true,
          },
        },
      },
    });
  }
}
