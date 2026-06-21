import {
  Controller,
  Post,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserLoginGuard } from 'src/authentication/guard/user.login.guard';
import { UserAccessTokenGuard } from 'src/authentication/guard/user.access.token.guard';
import { UserAuthService } from 'src/authentication/user.auth.service';
import { JwtRefreshUserGuard } from 'src/authentication/guard/jwt.refresh.user.guard';

@Controller('auth')
export class UserAuthController {
  constructor(private readonly authService: UserAuthService) {}

  @UseGuards(UserLoginGuard)
  @Post('login/user')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Request() req: any) {
    console.log('req user', req.user);
    return req.user;
  }

  @UseGuards(JwtRefreshUserGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req: any) {
    // Strategy ensures req.user has payload + refreshToken
    return this.authService.refreshTokens(
      req.user.userId,
      req.user.refreshToken,
    );
  }

  @UseGuards(UserAccessTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: any) {
    // Check if req.user is populated correctly by UserAccessTokenGuard
    // Usually jwt strategy returns payload.
    // Ensure payload has userId.
    await this.authService.logout(req.user.userId);
    return { message: 'Logged out successfully' };
  }
}
