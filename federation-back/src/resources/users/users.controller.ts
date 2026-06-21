import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAccessTokenGuard } from 'src/authentication/guard/user.access.token.guard';
import { PoliciesGuard } from 'src/iam/guards/policies.guard';
import { CheckPolicies } from 'src/iam/decorators/check-policies.decorator';
import { ActiveUser } from '../../iam/decorators/active-user.decorator';

@UseGuards(UserAccessTokenGuard, PoliciesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @CheckPolicies((ability) => ability.can('create', 'User'))
  create(
    @Body() createUserDto: CreateUserDto,
    @ActiveUser('companyId') companyId: string,
  ) {
    return this.usersService.create(createUserDto, companyId);
  }

  @Get('me')
  getProfile(@ActiveUser('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Get()
  @CheckPolicies((ability) => ability.can('read', 'User'))
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can('read', 'User'))
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can('update', 'User'))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can('delete', 'User'))
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
