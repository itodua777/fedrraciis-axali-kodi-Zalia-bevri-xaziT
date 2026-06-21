import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { UserAccessTokenGuard } from '../../authentication/guard/user.access.token.guard';
import { PoliciesGuard } from '../../iam/guards/policies.guard';
import { CheckPolicies } from '../../iam/decorators/check-policies.decorator';
import { ActiveUser } from '../../iam/decorators/active-user.decorator';

@UseGuards(UserAccessTokenGuard, PoliciesGuard)
@Controller('branches')
export class BranchesController {
    constructor(private readonly branchesService: BranchesService) { }

    @Post()
    @CheckPolicies((ability) => ability.can('create', 'Branch'))
    create(
        @Body() createBranchDto: CreateBranchDto,
        @ActiveUser('companyId') companyId: string,
    ) {
        return this.branchesService.create(createBranchDto, companyId);
    }

    @Get()
    @CheckPolicies((ability) => ability.can('read', 'Branch'))
    findAll() {
        return this.branchesService.findAll();
    }

    @Get(':id')
    @CheckPolicies((ability) => ability.can('read', 'Branch'))
    findOne(@Param('id') id: string) {
        return this.branchesService.findOne(id);
    }

    @Patch(':id')
    @CheckPolicies((ability) => ability.can('update', 'Branch'))
    update(
        @Param('id') id: string,
        @Body() updateBranchDto: UpdateBranchDto,
    ) {
        return this.branchesService.update(id, updateBranchDto);
    }

    @Delete(':id')
    @CheckPolicies((ability) => ability.can('delete', 'Branch'))
    delete(@Param('id') id: string) {
        return this.branchesService.delete(id);
    }
}
