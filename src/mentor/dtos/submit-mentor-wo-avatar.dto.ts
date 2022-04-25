import { OmitType } from '@nestjs/swagger';
import { SubmitMentorDto } from './submit-mentor.dto';

export class SubmitMentorWoAvatarDto extends OmitType(SubmitMentorDto, [
  'avatar',
]) {}
