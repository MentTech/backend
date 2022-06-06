import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MenteeService } from './mentee.service';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../decorators/get-user.decorator';
import { AddFavoriteDto } from './dto/add-favorite.dto';
import { UserQueryPaginationDto } from '../users/dtos/user-query-pagination.dto';
import { UpdateUserDto } from '../users/dtos/update-user.dto';
import { UserDto } from '../dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { SessionQueryDto } from '../dtos/session-query.dto';

@Controller('mentee')
@ApiTags('Mentee')
export class MenteeController {
  constructor(private readonly menteeService: MenteeService) {}

  @Get('/')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get mentees (ADMIN)' })
  @ApiBearerAuth()
  findAll(@Query() query: UserQueryPaginationDto) {
    return this.menteeService.findAll(query);
  }

  @Get('/mysession')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTEE)
  @ApiOperation({ summary: 'Get my session' })
  @ApiBearerAuth()
  getMySession(@GetUser() user: User, @Query() query: SessionQueryDto) {
    return this.menteeService.getMySession(user.id, query);
  }

  @Get('/favorite')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTEE)
  @ApiOperation({ summary: 'Get my favorite mentor' })
  @ApiBearerAuth()
  getMyFavoriteMentor(@GetUser() user: User) {
    return this.menteeService.getFavorites(user.id);
  }

  @Post('/favorite')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTEE)
  @ApiOperation({ summary: 'Add a favorite mentor' })
  @ApiBearerAuth()
  addFavoriteMentor(@GetUser() user: User, @Body() body: AddFavoriteDto) {
    return this.menteeService.addToFavorite(user.id, body.mentorId);
  }

  @Delete('/favorite/:id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTEE)
  @ApiOperation({ summary: 'Remove a favorite mentor' })
  @ApiBearerAuth()
  removeFavoriteMentor(@GetUser() user: User, @Param('id') mentorId: string) {
    return this.menteeService.removeFromFavorite(user.id, +mentorId);
  }

  @Get(':id')
  @Serialize(UserDto)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get a mentee (ADMIN)' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.menteeService.findOne(+id);
  }

  @Patch(':id')
  @Serialize(UserDto)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a mentee (ADMIN)' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateMenteeDto: UpdateUserDto) {
    return this.menteeService.update(+id, updateMenteeDto);
  }
}
