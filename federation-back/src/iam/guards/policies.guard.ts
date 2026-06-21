import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from '../decorators/check-policies.decorator';
import { RolesCacheService } from '../roles-cache.service';

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
        private readonly rolesCacheService: RolesCacheService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyHandlers =
            this.reflector.get<PolicyHandler[]>(
                CHECK_POLICIES_KEY,
                context.getHandler(),
            ) || [];

        if (policyHandlers.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user; // ActiveUserData populated by UserAccessTokenGuard

        if (!user) return false;

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
