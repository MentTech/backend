import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserDto {
  id: number;
  email: string;
  name: string;
  birthday: Date;
  phone: string;
  avatar: string;
  coin: number;

  @Exclude()
  password: string;

  @Exclude()
  role: string;
}
