import { Role } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';

class UserMentorResponseDto {
  introduction: string;
  linkedin: string;
  @Transform(({ value }) => value.toNumber())
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
  id: number;

  name: string;
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
  User_mentor: MentorResponseDto;

  constructor(mentor: Partial<MentorResponseDto>) {
    Object.assign(this, mentor);
  }
}
