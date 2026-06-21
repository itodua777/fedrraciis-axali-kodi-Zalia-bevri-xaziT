import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserLoginGuard extends AuthGuard('user-local-login') {}
