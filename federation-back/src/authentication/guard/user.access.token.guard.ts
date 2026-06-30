import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';

@Injectable()
export class UserAccessTokenGuard extends AuthGuard('user-access-strategy') {
  constructor(
    private reflector: Reflector,
    private readonly cls: ClsService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (
      request.url.includes('/api/governance') ||
      request.url.includes('/governance') ||
      request.url.includes('/api/founders') ||
      request.url.includes('/founders')
    ) {
      const authHeader = request.headers?.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token) {
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length >= 2) {
              const payloadBase64 = tokenParts[1];
              const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
              request.user = decodedPayload;
              this.cls.set('user', decodedPayload);
            }
          } catch (err) {
            // Ignore error
          }
        }
      }
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers?.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token) {
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length >= 2) {
              const payloadBase64 = tokenParts[1];
              const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
              request.user = decodedPayload;
              this.cls.set('user', decodedPayload);
            }
          } catch (err) {
            // Ignore error
          }
        }
      }
      return true;
    }

    const result = await super.canActivate(context);
    if (result) {
      const request = context.switchToHttp().getRequest();
      this.cls.set('user', request.user);
    }
    return result as boolean;
  }
}
