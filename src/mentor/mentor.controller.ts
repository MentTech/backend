import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AcceptMentorDto } from './dtos/accept-mentor.dto';
import { MentorQueryDto } from './dtos/mentor-query.dto';
import { MentorResponseDto } from './dtos/mentor-response.dto';
import { SearchMentorDto } from './dtos/search-mentor.dto';
import { MentorService } from './mentor.service';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';
import { GetRatingQueryDto } from './dtos/get-rating-query.dto';
import { AverageResponseDto } from '../dtos/average-response.dto';
import { SuggestQueryDto } from './dtos/suggest-query.dto';
import { UpdateMentorDto } from './dtos/update-mentor.dto';
import { GetUser } from '../decorators/get-user.decorator';
import * as _ from 'lodash';
import { SubmitMentorDto } from './dtos/submit-mentor.dto';
import { GetRatingsQueryDto } from '../rating/dto/get-ratings-query.dto';
import { SessionStatisticService } from './session-statistic.service';
import { MentorGuard } from '../guards/mentor.guard';
import { SessionStatisticMentorQueryDto } from './dtos/session-statistic-mentor-query.dto';
import { GetMultipleMentorsDto } from './dtos/get-multiple-mentors.dto';
import { SessionMentorQueryDto } from './dtos/session-mentor-query.dto';

@Controller('mentor')
@ApiTags('Mentor')
export class MentorController {
  constructor(
    private readonly mentorService: MentorService,
    private readonly sessionStatisticService: SessionStatisticService,
  ) {}

  @Post('/apply')
  @ApiResponse({
    status: 201,
    description: 'Form submitted',
  })
  @ApiOperation({ summary: 'submit mentor application (add avatar to body)' })
  submitForm(@Body() form: SubmitMentorDto) {
    return this.mentorService.submitMentor(form);
  }

  @Patch('/profile')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTOR)
  @ApiOperation({ summary: 'update mentor profile' })
  @ApiBearerAuth()
  updateSelfProfile(@Body() form: UpdateMentorDto, @GetUser() user: User) {
    return this.mentorService.updateMentor(user.id, form);
  }

  @Get('/multiple')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get multiple mentors detail information' })
  @ApiBearerAuth()
  async getMultipleMentors(@Query() dto: GetMultipleMentorsDto) {
    const mentors = await this.mentorService.getMultipleMentors(dto.ids);
    return mentors.map((mentor) => new MentorResponseDto(mentor));
  }

  @Get('/')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({
    description: 'Get mentors success',
  })
  @ApiOperation({ summary: 'get mentors' })
  @ApiBearerAuth()
  getMentors(@Query() query: MentorQueryDto) {
    return this.mentorService.getMentors(query.pending);
  }

  @Post('/:id/accept')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'accept mentor application' })
  @ApiBearerAuth()
  acceptMentor(@Param() param: AcceptMentorDto) {
    return this.mentorService.acceptMentor(param.id);
  }

  @Get('/search')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Search mentor' })
  @ApiResponse({
    status: 200,
    type: PaginationResponseDto,
  })
  async searchMentor(@Query() query: SearchMentorDto) {
    const response = await this.mentorService.searchMentor(query);
    response.data = response.data.map(
      (mentor) => new MentorResponseDto(mentor),
    );
    return response;
  }

  @Get('/suggest')
  @ApiOperation({ summary: 'Get top 3 mentors' })
  suggestHotMentor() {
    return this.mentorService.getHotMentors();
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get mentor by id' })
  @ApiResponse({
    status: 200,
    type: MentorResponseDto,
  })
  async getMentor(@Param('id') id: string) {
    const mentor: any = await this.mentorService.getMentor(+id);
    const averageRating = await this.mentorService.averageRating(+id);
    return new MentorResponseDto({ ...mentor, averageRating });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update mentor (ADMIN)' })
  @ApiBearerAuth()
  updateMentor(@Param('id') id: string, @Body() form: UpdateMentorDto) {
    return this.mentorService.updateMentor(+id, form);
  }

  @Get('/:mentorId/register')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.MENTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Get mentor register' })
  @ApiBearerAuth()
  getSessions(
    @Param('mentorId') mentorId: string,
    @Query() query: SessionMentorQueryDto,
  ) {
    return this.sessionStatisticService.getSessions(query, +mentorId);
  }

  @Get('/:mentorId/register/count')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.MENTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Get mentor register count' })
  @ApiBearerAuth()
  getMentorRegisterCount(
    @Param('mentorId') mentorId: string,
    @Query() query: SessionStatisticMentorQueryDto,
  ) {
    return this.sessionStatisticService.getSessionCount(query, +mentorId);
  }

  @Get('/:id/admin')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get mentor by id (admin route)' })
  @ApiResponse({
    status: 200,
    type: MentorResponseDto,
  })
  @ApiBearerAuth()
  async getMentorAdmin(@Param('id') id: string) {
    const mentor = await this.mentorService.getMentor(+id, false);
    return _.omit(mentor, ['password']);
  }

  @Get('/:id/rating')
  @ApiOperation({ summary: 'Get mentor ratings' })
  @ApiResponse({
    status: 200,
    type: PaginationResponseDto,
  })
  getAllRating(@Param('id') id: string, @Query() query: GetRatingQueryDto) {
    return this.mentorService.getAllRating(+id, query);
  }

  @Get('/:id/rating/average')
  @ApiOperation({ summary: 'Get mentor average rating' })
  @ApiResponse({
    status: 200,
    type: AverageResponseDto,
  })
  getAverageRating(@Param('id') id: string) {
    return this.mentorService.averageRating(+id);
  }

  @Get('/:id/rating/feature')
  @ApiOperation({ summary: 'Get mentor feature rating' })
  getFeatureRating(@Param('id') id: string) {
    return this.mentorService.getFeaturedRatings(+id);
  }

  @Patch('/:id/rating/feature')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.MENTOR)
  @ApiOperation({ summary: 'Update mentor feature rating (Maximum 5 ratings)' })
  @ApiBearerAuth()
  updateFeatureRating(
    @Param('id') id: string,
    @Body() form: GetRatingsQueryDto,
  ) {
    return this.mentorService.changeFeaturedRatings(+id, form.ids);
  }

  @Get('/:id/suggest')
  @ApiOperation({ summary: 'Get mentor suggestions' })
  getSuggestion(@Param('id') id: string, @Query('num') query: SuggestQueryDto) {
    return this.mentorService.suggestMentors(+id, query.num);
  }

  @Get('/:id/mentee/count')
  @ApiOperation({ summary: 'Get mentor mentee count' })
  getMenteeCount(@Param('id') id: string) {
    return this.mentorService.getNumberOfMentee(+id);
  }
}
