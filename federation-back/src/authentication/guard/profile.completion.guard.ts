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
    const request = context.switchToHttp().getRequest();
    if (
      request.url.includes('/api/governance') ||
      request.url.includes('/governance') ||
      request.url.includes('/api/founders') ||
      request.url.includes('/founders')
    ) {
      return true;
    }

    // 1. Check if the route is public via the @Public() decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const path = request.path || request.url || '';

    // Normalize path by stripping query parameters and any duplicate leading/trailing slashes
    const cleanPath = path.split('?')[0].replace(/^\/+|\/+$/g, '');

    // 2. Bypass authentication, registration, profile, and structure/roles endpoints
    const bypassPaths = [
      'auth',
      'companies/profile',
      'companies/register',
      'hr/structure',
      'api/structure',
      'hr/members',
      'api/v1/hr/members',
      'api/v1/hr/structure',
      'api/governance',
      'api/founders',
    ];
    const isBypassed = bypassPaths.some((p) => cleanPath === p || cleanPath.startsWith(p + '/'));
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

    // 4. Query company completeness status in the database based on 5 foundational fields
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        name: true,
        identificationCode: true,
        sportsDomain: true,
        legalForm: true,
        branches: {
          take: 1,
          select: {
            legalAddress: true,
          },
        },
      },
    });

    if (!company) {
      return true;
    }

    const isComplete = !!(
      company.name &&
      company.name.trim() !== '' &&
      company.identificationCode &&
      company.identificationCode.trim() !== '' &&
      company.sportsDomain &&
      company.sportsDomain.trim() !== '' &&
      company.legalForm &&
      company.legalForm.trim() !== '' &&
      company.branches &&
      company.branches.length > 0 &&
      company.branches[0].legalAddress &&
      company.branches[0].legalAddress.trim() !== ''
    );

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
