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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AcceptMentorDto } from './dtos/accept-mentor.dto';
import { MentorQueryDto } from './dtos/mentor-query.dto';
import { MentorResponseDto } from './dtos/mentor-response.dto';
import { SearchMentorDto } from './dtos/search-mentor.dto';
import { SubmitMentorDto } from './dtos/submit-mentor.dto';
import { MentorService } from './mentor.service';

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
  async searchMentor(@Query() query: SearchMentorDto) {
    const mentors = await this.mentorService.searchMentor(query);
    return mentors.map((mentor) => new MentorResponseDto(mentor));
  }
}
