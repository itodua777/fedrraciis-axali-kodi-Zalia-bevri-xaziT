import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'src/resources/users/users.repository';
import { HashingService } from '../hashing/hashing.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-user',
) {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const authHeader = req.get('Authorization');
    // console.log('auth header', authHeader);
    if (!authHeader) throw new UnauthorizedException('Refresh token missing');

    const refreshToken = authHeader.replace('Bearer', '').trim();
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token malformed');

    const user = await this.userRepository.findById(payload.userId);
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const isRefreshTokenMatching = await this.hashingService.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenMatching)
      throw new UnauthorizedException('Invalid refresh token');

    return { ...payload, refreshToken };
  }
}
