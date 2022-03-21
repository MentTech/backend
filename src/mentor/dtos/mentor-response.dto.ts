import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';

class UserMentorResponseDto {
  @ApiProperty({ example: 'Hello' })
  introduction: string;
  @ApiProperty({ example: '1234' })
  linkedin: string;
  @Transform(({ value }) => value.toNumber())
  @ApiProperty({ example: 5 })
  rating: number;
  @Exclude()
  userId: string;
  @Exclude()
  categoryId: number;
  @Exclude()
  isAccepted: boolean;
  @Exclude()
  createAt: Date;

  constructor(mentor: Partial<UserMentorResponseDto>) {
    Object.assign(this, mentor);
  }
}

export class MentorResponseDto {
  @Exclude()
  @ApiProperty({
    example: '1',
  })
  id: number;

  @ApiProperty({
    example: 'John',
  })
  name: string;
  @ApiProperty({
    example: '2020-01-01T00:00:00.000Z',
  })
  birthday: Date;
  @Exclude()
  email: string;
  @Exclude()
  password: string;
  @Exclude()
  role: Role;
  @Exclude()
  phone: string;
  @Exclude()
  isActive: boolean;
  @Exclude()
  coin: number;
  @Exclude()
  createAt: Date;
  @Transform(({ value }) => new UserMentorResponseDto(value))
  @ApiProperty({
    type: UserMentorResponseDto,
  })
  User_mentor: MentorResponseDto;

  constructor(mentor: Partial<MentorResponseDto>) {
    Object.assign(this, mentor);
  }
}
