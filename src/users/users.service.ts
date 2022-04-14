import {BadRequestException, Injectable} from '@nestjs/common';
import {Prisma, Role} from '@prisma/client';
import {PrismaService} from '../prisma/prisma.service';
import {CreateUserDto} from './dtos/create-user.dto';
import {UpdateUserDto} from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  createUser(user: CreateUserDto, role: Role, isPasswordSet: boolean) {
    const userCreate: Prisma.UserCreateInput = {
      ...user,
      role,
      isPasswordSet,
    }
    if (role === Role.MENTEE) {
      userCreate.User_mentee = {
        create: {}
      }
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

  findAll() {
    return this.prisma.user.findMany({});
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
}
