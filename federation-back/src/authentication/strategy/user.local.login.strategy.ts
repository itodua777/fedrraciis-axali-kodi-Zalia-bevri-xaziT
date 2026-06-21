import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserAuthService } from '../user.auth.service';

@Injectable()
export class UserLocalLoginStrategy extends PassportStrategy(
  Strategy,
  'user-local-login',
) {
  constructor(private userAuthService: UserAuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userAuthService.validateUserLogin(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
