import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async hash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async compare(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
