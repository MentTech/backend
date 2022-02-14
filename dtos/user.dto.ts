import { Exclude } from 'class-transformer';

export class UserDto {
  id: number;

  email: string;

  name: string;

  @Exclude()
  password: string;

  @Exclude()
  role: string;
}
