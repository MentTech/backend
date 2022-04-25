import { OmitType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

export class UpdateUserWoAvatarDto extends OmitType(UpdateUserDto, [
  'avatar',
]) {}
