import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PoliciesGuard } from '../../iam/guards/policies.guard';
import { CheckPolicies } from '../../iam/decorators/check-policies.decorator';
import { UserAccessTokenGuard } from '../../authentication/guard/user.access.token.guard';
import { ActiveUser } from '../../iam/decorators/active-user.decorator';

@UseGuards(UserAccessTokenGuard, PoliciesGuard)
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    @CheckPolicies((ability) => ability.can('create', 'Role'))
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @Patch(':id')
    @CheckPolicies((ability) => ability.can('update', 'Role'))
    update(
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto,
        @ActiveUser('companyId') companyId: string,
    ) {
        return this.rolesService.update(id, updateRoleDto, companyId);
    }

    @Delete(':id')
    @CheckPolicies((ability) => ability.can('delete', 'Role'))
    delete(@Param('id') id: string) {
        return this.rolesService.delete(id);
    }

    @Get()
    @CheckPolicies((ability) => ability.can('read', 'Role'))
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    @CheckPolicies((ability) => ability.can('read', 'Role'))
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id);
    }
}
