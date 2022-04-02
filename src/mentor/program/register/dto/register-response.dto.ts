import { ApiProperty } from '@nestjs/swagger';
import { ProgramResponseDto } from './program-response.dto';
import { Exclude, Transform } from 'class-transformer';

export class UserProgramDto {
  @Exclude()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @Exclude()
  birthday: Date;

  @Exclude()
  phone: string;

  @ApiProperty()
  avatar: string;
  @Exclude()
  coin: number;

  @Exclude()
  password: string;

  @Exclude()
  role: string;

  constructor(user: Partial<UserProgramDto>) {
    Object.assign(this, user);
  }
}

export class RegisterResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  programId: number;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  isAccepted: boolean;
  @ApiProperty()
  done: boolean;
  @ApiProperty()
  contactInfo?: string;
  @ApiProperty()
  additional?: object;
  @ApiProperty()
  expectedDate: Date;
  @ApiProperty()
  createdAt: Date;
  @Transform(({ value }) => new ProgramResponseDto(value))
  @ApiProperty({
    type: ProgramResponseDto,
  })
  program: ProgramResponseDto;
  @Transform(({ value }) => new UserProgramDto(value))
  @ApiProperty({
    type: UserProgramDto,
  })
  user: UserProgramDto;

  constructor(register: Partial<RegisterResponseDto>) {
    Object.assign(this, register);
  }
}
