import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl/casl-ability.factory';
import { PoliciesGuard } from './guards/policies.guard';
import { RolesCacheService } from './roles-cache.service';

@Module({
    providers: [CaslAbilityFactory, PoliciesGuard, RolesCacheService],
    exports: [CaslAbilityFactory, PoliciesGuard, RolesCacheService],
})
export class IamModule { }
