import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards,} from '@nestjs/common';
import {MenteeService} from './mentee.service';
import {CreateMenteeDto} from './dto/create-mentee.dto';
import {UpdateMenteeDto} from './dto/update-mentee.dto';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import {RolesGuard} from '../guards/roles.guard';
import {Roles} from '../decorators/roles.decorator';
import {Role, User} from '@prisma/client';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {GetUser} from '../decorators/get-user.decorator';
import {AddFavoriteDto} from "./dto/add-favorite.dto";

@Controller('mentee')
@ApiTags('Mentee')
export class MenteeController {
  constructor(private readonly menteeService: MenteeService) {}

  @Post()
  create(@Body() createMenteeDto: CreateMenteeDto) {
    return this.menteeService.create(createMenteeDto);
  }

  @Get()
  findAll() {
    return this.menteeService.findAll();
  }

  @Get('/mysession')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTEE)
  @ApiOperation({ summary: 'Get my session' })
  @ApiBearerAuth()
  getMySession(@GetUser() user: User) {
    return this.menteeService.getMySession(user.id);
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
  addFavoriteMentor(
    @GetUser() user: User,
    @Body() body: AddFavoriteDto,
  ) {
    return this.menteeService.addToFavorite(user.id, body.mentorId);
  }

  @Delete('/favorite/:id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTEE)
  @ApiOperation({ summary: 'Remove a favorite mentor' })
  @ApiBearerAuth()
  removeFavoriteMentor(
    @GetUser() user: User,
    @Param('id') mentorId: string,
  ) {
    return this.menteeService.removeFromFavorite(user.id, +mentorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menteeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenteeDto: UpdateMenteeDto) {
    return this.menteeService.update(+id, updateMenteeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menteeService.remove(+id);
  }
}
