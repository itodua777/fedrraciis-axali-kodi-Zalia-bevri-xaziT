import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { CHECK_PERMISSIONS_KEY, RequiredPermission } from '../decorators/check-permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<RequiredPermission>(
      CHECK_PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userPayload = request.user;

    if (!userPayload) {
      return false;
    }

    // SuperUser bypass
    if (userPayload.isSuperUser) {
      return true;
    }

    // Load the user with their assigned structureUnit and module permissions
    const user = await this.prisma.user.findUnique({
      where: { id: userPayload.userId },
      include: {
        structureUnit: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user || !user.structureUnit) {
      throw new ForbiddenException('User is not assigned to any organizational unit / role');
    }

    const permissions = user.structureUnit.permissions;
    const requiredModule = requiredPermission.module;
    const requiredAction = requiredPermission.action;

    const modulePermission = permissions.find(
      (p) => p.module.toLowerCase() === requiredModule.toLowerCase(),
    );

    if (!modulePermission) {
      throw new ForbiddenException(`Insufficient permissions for module: ${requiredModule}`);
    }

    // Full control or specific permission flags
    const hasAccess =
      modulePermission.fullControl ||
      (requiredAction === 'create' && modulePermission.create) ||
      (requiredAction === 'read' && modulePermission.read) ||
      (requiredAction === 'update' && modulePermission.update) ||
      (requiredAction === 'delete' && modulePermission.delete) ||
      (requiredAction === 'fullControl' && modulePermission.fullControl);

    if (!hasAccess) {
      throw new ForbiddenException(
        `Insufficient permissions: ${requiredAction} on module ${requiredModule}`,
      );
    }

    return true;
  }
}
