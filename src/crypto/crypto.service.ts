import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicKey, createVerify } from 'crypto';

@Injectable()
export class CryptoService {
  constructor(private readonly configService: ConfigService) {}

  verifySign(data: string, sign: string): boolean {
    const publicKeyStr = this.configService.get<string>('ekycPublicKey');
    const verifier = createVerify('RSA-SHA256');
    const publicKeyAppend =
      '-----BEGIN PUBLIC KEY-----\n' +
      publicKeyStr +
      '\n-----END PUBLIC KEY-----';
    const publicKey = createPublicKey(publicKeyAppend);
    return verifier.update(data).verify(publicKey, sign, 'base64');
  }

  decodeBase64(data: string): string {
    return Buffer.from(data, 'base64').toString('utf8');
  }

  decodeBase64AndParse(data: string): any {
    return JSON.parse(this.decodeBase64(data));
  }
}
