import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { UserAccessTokenGuard } from '../../authentication/guard/user.access.token.guard';
import { PoliciesGuard } from '../../iam/guards/policies.guard';
import { CheckPolicies } from '../../iam/decorators/check-policies.decorator';
import { ActiveUser } from '../../iam/decorators/active-user.decorator';

@UseGuards(UserAccessTokenGuard, PoliciesGuard)
@Controller('departments')
export class DepartmentsController {
    constructor(private readonly departmentsService: DepartmentsService) { }

    @Post()
    @CheckPolicies((ability) => ability.can('create', 'Department'))
    create(
        @Body() createDepartmentDto: CreateDepartmentDto,
        @ActiveUser('companyId') companyId: string,
    ) {
        return this.departmentsService.create(createDepartmentDto, companyId);
    }

    @Get()
    @CheckPolicies((ability) => ability.can('read', 'Department'))
    findAll() {
        return this.departmentsService.findAll();
    }

    @Get(':id')
    @CheckPolicies((ability) => ability.can('read', 'Department'))
    findOne(@Param('id') id: string) {
        return this.departmentsService.findOne(id);
    }

    @Patch(':id')
    @CheckPolicies((ability) => ability.can('update', 'Department'))
    update(
        @Param('id') id: string,
        @Body() updateDepartmentDto: UpdateDepartmentDto,
    ) {
        return this.departmentsService.update(id, updateDepartmentDto);
    }

    @Delete(':id')
    @CheckPolicies((ability) => ability.can('delete', 'Department'))
    delete(@Param('id') id: string) {
        return this.departmentsService.delete(id);
    }
}
