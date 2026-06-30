import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from '../decorators/check-policies.decorator';
import { RolesCacheService } from '../roles-cache.service';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../../common/decorator/public.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
        private readonly rolesCacheService: RolesCacheService,
        private readonly prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const policyHandlers =
            this.reflector.get<PolicyHandler[]>(
                CHECK_POLICIES_KEY,
                context.getHandler(),
            ) || [];

        if (policyHandlers.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user; // ActiveUserData populated by UserAccessTokenGuard

        if (!user) return false;

        // Fetch user's role from DB to identify if they are an admin/owner
        let roleName = '';
        let isOwner = false;
        if (user.roleId) {
            const role = await this.prisma.role.findUnique({
                where: { id: user.roleId },
            });
            if (role) {
                roleName = role.name;
                if (role.name === 'company_admin' && role.companyId === user.companyId) {
                    isOwner = true;
                }
            }
        }

        // Attach owner identity properties
        user.roleName = roleName;
        user.isOwner = isOwner;

        // Fetch permissions for the role from cache/DB
        const permissions = await this.rolesCacheService.getPermissionsForRole(user.roleId);

        // Build ability
        const ability = this.caslAbilityFactory.createForUser(user, permissions);

        return policyHandlers.every((handler) =>
            this.execPolicyHandler(handler, ability),
        );
    }

    private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
        if (typeof handler === 'function') {
            return handler(ability);
        }
        return handler.handle(ability);
    }
}
