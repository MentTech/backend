import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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
  submitForm(@Body() form: SubmitMentorDto) {
    return this.mentorService.submitMentor(form);
  }
}
