import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { BcryptService } from './bcrypt.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => UsersModule),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get<string>('jwt.jwtSecret'),
          signOptions: {
            expiresIn: config.get<string>('jwt.jwtExpire'),
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, BcryptService],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
