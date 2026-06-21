import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../../common/decorator/public.decorator';

@Injectable()
export class ProfileCompletionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Check if the route is public via the @Public() decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const path = request.path || request.url || '';

    // 2. Bypass authentication, registration, and profile endpoints
    const bypassPaths = [
      '/auth',
      '/companies/profile',
      '/companies/register',
    ];
    const isBypassed = bypassPaths.some((p) => path.startsWith(p));
    if (isBypassed) {
      return true;
    }

    // 3. Extract the authorization token
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // If there is no token, let the standard AuthGuard handle the request downstream
      return true;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return true;
    }

    // Decode the token payload safely using base64 buffer conversion (no external library dependency)
    const tokenParts = token.split('.');
    if (tokenParts.length < 2) {
      return true;
    }

    let decodedPayload: any;
    try {
      const payloadBase64 = tokenParts[1];
      decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
    } catch (err) {
      // If token payload format is invalid, let the standard AuthGuard handle it
      return true;
    }

    const companyId = decodedPayload?.companyId;
    if (!companyId) {
      return true;
    }

    // 4. Query company completeness status in the database
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        bankName: true,
        iban: true,
        publicEmail: true,
      },
    });

    if (!company) {
      return true;
    }

    const isComplete =
      company.bankName &&
      company.bankName.trim() !== '' &&
      company.iban &&
      company.iban.trim() !== '' &&
      company.publicEmail &&
      company.publicEmail.trim() !== '';

    if (!isComplete) {
      throw new HttpException(
        {
          statusCode: 403,
          message: 'ფუნქციონალის გამოსაყენებლად სავალდებულოა ფედერაციის პროფილის სრული შევსება.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
