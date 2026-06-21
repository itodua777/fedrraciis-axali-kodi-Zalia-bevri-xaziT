# Controller Layer Standards

Controllers are responsible for routing, extracting request payloads, executing input validation, and delegation to the Service layer.

---

## 1. Directory Structure

Controllers must be located inside their resource folder:
`src/resources/<resource-name>/<resource-name>.controller.ts`

---

## 2. Standard Structure & Boilerplate

Every controller must follow this structure:

```typescript
import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAccessTokenGuard } from '../../authentication/guard/user.access.token.guard';
import { PoliciesGuard } from '../../iam/guards/policies.guard';
import { CheckPolicies } from '../../iam/decorators/check-policies.decorator';
import { ActiveUser } from '../../iam/decorators/active-user.decorator';

@UseGuards(UserAccessTokenGuard, PoliciesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @CheckPolicies((ability) => ability.can('create', 'User'))
    create(
        @Body() createUserDto: CreateUserDto,
        @ActiveUser('companyId') companyId: string,
    ) {
        // Pass companyId from the JWT if needed, though Prisma middleware also scopes it.
        return this.usersService.create(createUserDto, companyId);
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
        @ActiveUser('companyId') companyId: string,
    ) {
        return this.usersService.update(id, updateUserDto, companyId);
    }

    @Delete(':id')
    @CheckPolicies((ability) => ability.can('delete', 'User'))
    delete(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
```

---

## 3. Mandatory Best Practices

1. **Authentication and Policies Guards**:
   - Every tenant-scoped controller must be decorated with `@UseGuards(UserAccessTokenGuard, PoliciesGuard)`.
   - Never skip authorization checks on endpoints unless explicitly marked as `@Public()`.
2. **DTO Validation**:
   - Use `class-validator` decorators on all DTOs (e.g. `@IsString()`, `@IsNotEmpty()`, `@ValidateNested()`).
   - Use `@Type(() => ClassName)` from `class-transformer` for nested structures.
3. **Active User Extraction**:
   - Use the `@ActiveUser()` decorator to extract user information from the JWT payload.
   - Example: `@ActiveUser('companyId') companyId: string` or `@ActiveUser() user: ActiveUserData`.
4. **CASL Policy Decorator**:
   - Decorate every route handler with `@CheckPolicies((ability) => ability.can('<action>', '<Subject>'))`.
   - Action must be one of: `'create'`, `'read'`, `'update'`, `'delete'`, `'manage'`.
   - Subject must be a valid subject type declared in `CaslAbilityFactory`.
