import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

@Injectable()
export class SlugifyService {
  createSlug(str: string) {
    return slugify(str, {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true,
    });
  }

  createUniqueSlug(str: string) {
    return this.createSlug(str) + '-' + nanoid(5);
  }
}
