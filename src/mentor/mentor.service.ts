import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitMentorDto } from './dtos/submit-mentor.dto';
import * as _ from 'lodash';
import { SearchMentorDto } from './dtos/search-mentor.dto';
import { PaginationResponseDto } from 'src/dtos/pagination-response.dto';
import { MentorResponseDto } from './dtos/mentor-response.dto';
import { GetRatingQueryDto } from './dtos/get-rating-query.dto';
import { AverageResponseDto } from '../dtos/average-response.dto';
import { RatingService } from '../rating/rating.service';
import { UpdateMentorDto } from './dtos/update-mentor.dto';

@Injectable()
export class MentorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly ratingService: RatingService,
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
            cv: form.cv,
            linkedin: form.linkedin,
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
    const count = await this.prisma.user.count({
      where: query,
    });
    const totalPage = Math.ceil(count / limit);

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

  getAllRating(mentorId: number, query: GetRatingQueryDto) {
    const ratingWhereInput: Prisma.RatingWhereInput = {
      register: {
        program: {
          mentorId,
        },
      },
    };
    return this.ratingService.getRatingsPagination(ratingWhereInput, query);
  }

  async averageRating(mentorId: number): Promise<AverageResponseDto> {
    const ratingWhereInput: Prisma.RatingWhereInput = {
      register: {
        program: {
          mentorId,
        },
      },
    };
    const count = await this.prisma.rating.count({
      where: ratingWhereInput,
    });
    if (count === 0) {
      return new AverageResponseDto({
        average: 0,
        count,
      });
    }
    const avg = await this.prisma.rating.aggregate({
      where: ratingWhereInput,
      _avg: {
        rating: true,
      },
    });
    return new AverageResponseDto({
      count,
      average: avg._avg.rating,
    });
  }

  async changeFeaturedRatings(mentorId: number, ids: number[]) {
    if (ids.length > 5) {
      throw new BadRequestException('Maximum featured rating is 5');
    }
    const byMentor = await this.prisma.rating.findMany({
      where: {
        id: {
          in: ids,
        },
        register: {
          program: {
            mentorId,
          },
        },
      },
    });
    if (byMentor.length !== ids.length) {
      throw new BadRequestException('Rating not found or not belong to you');
    }
    await this.prisma.userMentor.update({
      where: {
        userId: mentorId,
      },
      data: {
        featuredRatings: ids,
      },
    });
    return {
      message: 'Featured ratings updated',
    };
  }

  async getFeaturedRatings(mentorId: number) {
    const mentor = await this.prisma.userMentor.findFirst({
      where: {
        userId: mentorId,
      },
    });
    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }
    return this.ratingService.getMultipleRating(mentor.featuredRatings);
  }

  async suggestMentors(mentorId: number, num: number = 5) {
    const mentor = await this.prisma.userMentor.findFirst({
      where: {
        userId: mentorId,
        isAccepted: true,
        User: {
          isActive: true,
        },
      },
      include: {
        skills: true,
      },
    });
    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }

    const skills = mentor.skills.map((skill) => skill.skillId);
    const category = mentor.categoryId;

    const whereInput: Prisma.UserWhereInput = {
      NOT: {
        id: mentorId,
      },
      role: Role.MENTOR,
      isActive: true,
      User_mentor: {
        isAccepted: true,
        OR: [
          {
            categoryId: category,
          },
          {
            skills: {
              some: {
                skillId: {
                  in: skills,
                },
              },
            },
          },
        ],
      },
    };
    const mentorCount = await this.prisma.user.findMany({
      where: whereInput,
    });
    const mentorIds = mentorCount.map((mentor) => mentor.id);
    const randomIds = _.sampleSize(mentorIds, num);
    return this.prisma.user.findMany({
      where: {
        id: {
          in: randomIds,
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        User_mentor: {
          include: {
            experiences: true,
          },
        },
      },
    });
  }

  async updateMentor(id: number, updateDto: UpdateMentorDto) {
    const mentor = await this.prisma.userMentor.findFirst({
      where: {
        userId: id,
      },
      include: {
        skills: true,
      },
    });
    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }
    const skills = mentor.skills.map((skill) => skill.skillId);
    if (updateDto.skillIds) {
      const skillToRemove = _.difference(skills, updateDto.skillIds);
      const skillToAdd = _.difference(updateDto.skillIds, skills);
      await this.prisma.$transaction([
        this.prisma.skillsOnMentors.deleteMany({
          where: {
            skillId: {
              in: skillToRemove,
            },
            mentorId: id,
          },
        }),
        this.prisma.skillsOnMentors.createMany({
          data: skillToAdd.map((skillId) => ({
            skillId,
            mentorId: id,
          })),
        }),
      ]);
    }
    const dto = _.omit(updateDto, ['skillIds']);
    return this.prisma.userMentor.update({
      where: {
        userId: id,
      },
      data: dto,
    });
  }
}
