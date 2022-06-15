import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { createHash } from 'crypto';
import { UserQueryPaginationDto } from './dtos/user-query-pagination.dto';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';
import * as _ from 'lodash';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  createUser(user: CreateUserDto, role: Role, isPasswordSet: boolean) {
    let email = user.email.trim().toLowerCase();
    const hash = createHash('md5').update(email).digest('hex');
    const avatar = `https://www.gravatar.com/avatar/${hash}?s=200`;
    const userCreate: Prisma.UserCreateInput = {
      ...user,
      avatar,
      role,
      isPasswordSet,
      isActive: !isPasswordSet,
    };
    if (role === Role.MENTEE) {
      userCreate.User_mentee = {
        create: {},
      };
    }
    try {
      return this.prisma.user.create({
        data: {
          ...userCreate,
        },
      });
    } catch (err) {
      throw new BadRequestException('Email is already exist');
    }
  }

  findById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  findUserByIdAndRole(id: number, role: Role) {
    return this.prisma.user.findFirst({
      where: {
        id,
        role,
      },
    });
  }

  findUsersWithQuery(where: Prisma.UserWhereInput) {
    return this.prisma.user.findMany({
      where,
    });
  }

  findUserPublicProfile(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });
  }

  async findAll(query: UserQueryPaginationDto, role: Role) {
    const { limit, page } = query;
    const where: Prisma.UserWhereInput = {
      name: {
        search: query.search,
      },
      role,
    };
    const count = await this.prisma.user.count({
      where,
    });
    const totalPage = Math.ceil(count / limit);
    const users = await this.prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [query.orderBy]: query.order,
      },
    });
    return new PaginationResponseDto({
      totalPage,
      data: users.map((user) => _.omit(user, ['password'])),
      limit,
      page,
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  changePassword(id: number, password: string) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
        isPasswordSet: true,
      },
    });
  }

  changeProfile(id: number, user: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...user,
      },
    });
  }

  lockUser(id: number) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }

  unlockUser(id: number) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
    });
  }
}
