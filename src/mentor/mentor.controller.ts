import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
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
import { Role } from '@prisma/client';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AcceptMentorDto } from './dtos/accept-mentor.dto';
import { MentorQueryDto } from './dtos/mentor-query.dto';
import { MentorResponseDto } from './dtos/mentor-response.dto';
import { SearchMentorDto } from './dtos/search-mentor.dto';
import { SubmitMentorDto } from './dtos/submit-mentor.dto';
import { MentorService } from './mentor.service';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';
import { GetRatingQueryDto } from './dtos/get-rating-query.dto';
import { AverageResponseDto } from '../dtos/average-response.dto';
import { SuggestQueryDto } from './dtos/suggest-query.dto';

@Controller('mentor')
@ApiTags('Mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Post('/apply')
  @ApiResponse({
    status: 201,
    description: 'Form submitted',
  })
  @ApiOperation({ summary: 'submit mentor application' })
  submitForm(@Body() form: SubmitMentorDto) {
    return this.mentorService.submitMentor(form);
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

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get mentor by id' })
  @ApiResponse({
    status: 200,
    type: MentorResponseDto,
  })
  async getMentor(@Param('id') id: string) {
    const mentor = await this.mentorService.getMentor(+id);
    return new MentorResponseDto(mentor as any);
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
    return new MentorResponseDto(mentor as any);
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

  @Get('/:id/suggest')
  @ApiOperation({ summary: 'Get mentor suggestions' })
  getSuggestion(@Param('id') id: string, @Query('num') query: SuggestQueryDto) {
    return this.mentorService.suggestMentors(+id, query.num);
  }
}
