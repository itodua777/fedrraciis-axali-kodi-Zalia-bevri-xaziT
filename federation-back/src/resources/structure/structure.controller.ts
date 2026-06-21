import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StructureService } from './structure.service';
import { CreateStructureUnitDto } from './dto/create-structure-unit.dto';
import { UpdateStructureUnitDto } from './dto/update-structure-unit.dto';
import { UserAccessTokenGuard } from '../../authentication/guard/user.access.token.guard';
import { PoliciesGuard } from '../../iam/guards/policies.guard';
import { CheckPolicies } from '../../iam/decorators/check-policies.decorator';
import { ActiveUser } from '../../iam/decorators/active-user.decorator';

@UseGuards(UserAccessTokenGuard, PoliciesGuard)
@Controller()
export class StructureController {
    constructor(private readonly structureService: StructureService) { }

    @Get('hr/structure')
    @CheckPolicies((ability) => ability.can('read', 'StructureUnit'))
    getTree(@ActiveUser('companyId') companyId: string) {
        return this.structureService.findTree(companyId);
    }

    @Post('hr/structure')
    @CheckPolicies((ability) => ability.can('create', 'StructureUnit'))
    create(
        @Body() dto: CreateStructureUnitDto,
        @ActiveUser('companyId') companyId: string,
    ) {
        return this.structureService.create(dto, companyId);
    }

    @Patch('hr/structure/:id')
    @CheckPolicies((ability) => ability.can('update', 'StructureUnit'))
    update(
        @Param('id') id: string,
        @Body() dto: UpdateStructureUnitDto,
        @ActiveUser('companyId') companyId: string,
    ) {
        return this.structureService.update(id, dto, companyId);
    }

    @Delete('hr/structure/:id')
    @CheckPolicies((ability) => ability.can('delete', 'StructureUnit'))
    remove(
        @Param('id') id: string,
        @ActiveUser('companyId') companyId: string,
    ) {
        return this.structureService.delete(id, companyId);
    }

    @Post('hr/structure/move')
    @CheckPolicies((ability) => ability.can('update', 'StructureUnit'))
    move(
        @Body() body: { draggedId: string; targetId: string | null },
        @ActiveUser('companyId') companyId: string,
    ) {
        return this.structureService.moveUnit(body.draggedId, body.targetId, companyId);
    }

    @Post(['hr/members', 'api/v1/hr/members'])
    @CheckPolicies((ability) => ability.can('update', 'User'))
    assignMember(
        @Body() body: { userId: string; unitId?: string; departmentId?: string },
        @ActiveUser('companyId') companyId: string,
    ) {
        const targetUnitId = body.unitId || body.departmentId || null;
        return this.structureService.assignMember(body.userId, targetUnitId, companyId);
    }

    @Get('hr/members/available')
    @CheckPolicies((ability) => ability.can('read', 'User'))
    getAvailableMembers(@ActiveUser('companyId') companyId: string) {
        return this.structureService.getCompanyUsers(companyId);
    }
}
