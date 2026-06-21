import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interface/jwt.payload';

@Injectable()
export class UserAccessStrategy extends PassportStrategy(
  Strategy,
  'user-access-strategy',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('KEY'),
    });
  }
  async validate(payload: JwtPayload) {
    return payload;
  }
}
