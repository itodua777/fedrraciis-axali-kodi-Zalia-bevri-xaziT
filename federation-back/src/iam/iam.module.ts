import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl/casl-ability.factory';
import { PoliciesGuard } from './guards/policies.guard';
import { RolesCacheService } from './roles-cache.service';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
    providers: [CaslAbilityFactory, PoliciesGuard, RolesCacheService, PermissionsGuard],
    exports: [CaslAbilityFactory, PoliciesGuard, RolesCacheService, PermissionsGuard],
})
export class IamModule { }
