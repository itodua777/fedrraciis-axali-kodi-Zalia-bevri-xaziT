import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
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
  constructor(private readonly structureService: StructureService) {}

  @Get('hr/structure')
  @CheckPolicies((ability) => ability.can('read', 'StructureUnit'))
  async getTree(
    @ActiveUser('companyId') companyId: string,
    @ActiveUser('email') currentUserEmail: string,
  ) {
    return await this.structureService.findTree(companyId, currentUserEmail);
  }

  @Post(['hr/structure', 'api/structure'])
  @CheckPolicies((ability) => ability.can('create', 'StructureUnit'))
  create(
    @Body() dto: CreateStructureUnitDto,
    @ActiveUser() user: any,
  ) {
    const companyId = user?.companyId;
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

  @Patch('api/structure/:id/reparent')
  @CheckPolicies((ability) => ability.can('update', 'StructureUnit'))
  reparent(
    @Param('id') id: string,
    @Body() body: { parentId: string | null },
    @ActiveUser('companyId') companyId: string,
  ) {
    return this.structureService.moveUnit(id, body.parentId, companyId);
  }

  @Delete('hr/structure/:id')
  @CheckPolicies((ability) => ability.can('delete', 'StructureUnit'))
  remove(@Param('id') id: string, @ActiveUser('companyId') companyId: string) {
    return this.structureService.delete(id, companyId);
  }

  @Post('hr/structure/move')
  @CheckPolicies((ability) => ability.can('update', 'StructureUnit'))
  move(
    @Body() body: { draggedId: string; targetId: string | null },
    @ActiveUser('companyId') companyId: string,
  ) {
    return this.structureService.moveUnit(
      body.draggedId,
      body.targetId,
      companyId,
    );
  }

  @Post(['hr/members', 'api/v1/hr/members'])
  @CheckPolicies((ability) => ability.can('update', 'User'))
  assignMember(
    @Body() body: { userId: string; unitId?: string; departmentId?: string },
    @ActiveUser('companyId') companyId: string,
  ) {
    const targetUnitId = body.unitId || body.departmentId || null;
    return this.structureService.assignMember(
      body.userId,
      targetUnitId,
      companyId,
    );
  }

  @Get('hr/members/available')
  @CheckPolicies((ability) => ability.can('read', 'User'))
  getAvailableMembers(@ActiveUser('companyId') companyId: string) {
    return this.structureService.getCompanyUsers(companyId);
  }

  @Patch('api/structure/:id/permissions')
  @CheckPolicies((ability) => ability.can('update', 'StructureUnit'))
  updatePermissions(
    @Param('id') id: string,
    @Body() body: { permissions: any },
    @ActiveUser('companyId') companyId: string,
  ) {
    return this.structureService.updatePermissions(id, body.permissions, companyId);
  }

  @Post('hr/structure/:id/save-member-and-permissions')
  @CheckPolicies((ability) => ability.can('update', 'StructureUnit'))
  async saveMemberAndPermissions(
    @Param('id') id: string,
    @Body() body: {
      member?: {
        id?: string;
        firstName: string;
        lastName: string;
        personalId: string;
        address?: string;
        phone?: string;
        email: string;
        bio?: string;
        photo?: string;
      };
      permissions: any;
    },
    @ActiveUser() user: any,
  ) {
    const companyId = user?.companyId;
    return this.structureService.saveMemberAndPermissions(
      id,
      body.member,
      body.permissions,
      companyId,
      user,
    );
  }
}
