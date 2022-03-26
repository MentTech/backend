import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Rating, Role, User } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitMentorDto } from './dtos/submit-mentor.dto';
import * as _ from 'lodash';
import { SearchMentorDto } from './dtos/search-mentor.dto';
import { PaginationResponseDto } from 'src/dtos/pagination-response.dto';
import { MentorResponseDto } from './dtos/mentor-response.dto';
import { GetRatingQueryDto } from './dtos/get-rating-query.dto';

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
            degree: {
              create: form.degree,
            },
            experiences: {
              create: form.experiences,
            },
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
            programs: true,
            category: true,
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

  async searchMentor(search: SearchMentorDto) {
    const { page, limit, order, orderBy } = search;
    const query: Prisma.UserWhereInput = {
      name: {
        search: search.keyword,
      },
      isActive: true,
      User_mentor: {
        isAccepted: true,
        categoryId: search.category,
        skills: {
          some: {
            skillId: {
              in: search.skills,
            },
          },
        },
      },
    };
    const totalPage = await this.prisma.user.count({
      where: query,
    });
    const mentors = await this.prisma.user.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [orderBy]: order,
      },
      where: query,
      include: {
        User_mentor: {
          include: {
            programs: true,
            category: true,
            skills: {
              include: {
                skill: true,
              },
            },
            degree: true,
            experiences: true,
          },
        },
      },
    });
    const filteredMentors = mentors.map((mentor: Partial<User> | any) => {
      mentor.User_mentor.skills = mentor.User_mentor.skills.map(
        (skill: any) => skill.skill,
      );
      return mentor;
    });
    return {
      totalPage,
      page,
      limit,
      data: filteredMentors,
    } as PaginationResponseDto<MentorResponseDto>;
  }

  async getMentor(id: number, activeOnly: boolean = true) {
    const mentor = await this.prisma.user.findFirst({
      where: {
        id,
        role: Role.MENTOR,
        isActive: activeOnly ? true : undefined,
        User_mentor: {
          isAccepted: activeOnly ? true : undefined,
        },
      },
      include: {
        User_mentor: {
          include: {
            programs: true,
            category: true,
            skills: {
              include: {
                skill: true,
              },
            },
            degree: true,
            experiences: true,
          },
        },
      },
    });
    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }
    mentor.User_mentor.skills = mentor.User_mentor.skills.map(
      (skill: any) => skill.skill,
    );
    return mentor;
  }

  async getAllRating(
    mentorId: number,
    query: GetRatingQueryDto,
  ): Promise<PaginationResponseDto<Rating>> {
    const { page, limit } = query;

    const ratingWhereInput: Prisma.RatingWhereInput = {
      register: {
        program: {
          mentorId,
        },
      },
    };

    const totalPage = await this.prisma.rating.count({
      where: ratingWhereInput,
    });

    const filteredRating = await this.prisma.rating.findMany({
      where: ratingWhereInput,
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      page,
      totalPage,
      limit,
      data: filteredRating,
    };
  }
}
