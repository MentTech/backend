import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { UserDto } from '../dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UsersService } from './users.service';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  avatarFileFilter,
  editAvatarFileName,
} from '../multer-utils/avatar.multer';
import { UpdateUserWoAvatarDto } from './dtos/update-user-wo-avatar.dto';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Serialize(UserDto)
  @UseGuards(JwtAuthenticationGuard)
  @Get('/profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'get profile success',
  })
  @ApiHeader({
    name: 'Bearer',
    description: 'Authentication',
  })
  getProfile(@GetUser() user: User) {
    return user;
  }

  @Patch('/profile')
  @UseGuards(JwtAuthenticationGuard)
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Change user profile' })
  @ApiResponse({
    status: 200,
    description: 'Change success',
  })
  updateProfile(@GetUser() user: User, @Body() userDto: UpdateUserWoAvatarDto) {
    return this.usersService.changeProfile(user.id, userDto);
  }

  @Patch('/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: editAvatarFileName,
      }),
      fileFilter: avatarFileFilter,
    }),
  )
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Change user avatar' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async changeAvatar(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No avatar uploaded');
    }
    await this.usersService.changeProfile(user.id, {
      avatar: `/avatars/${file.filename}`,
    });
    return {
      message: 'Avatar changed',
    };
  }

  @Patch('/:id/lock')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lock user (ADMIN)' })
  lockUser(@Param('id') id: string) {
    return this.usersService.lockUser(+id);
  }
}
