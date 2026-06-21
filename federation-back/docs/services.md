# Service Layer Standards

Services contain core business logic, orchestrate data flows between controllers and repositories, handle cache invalidation, and manage transaction scopes.

---

## 1. Directory Structure

Services must be located inside their resource folder:
`src/resources/<resource-name>/<resource-name>.service.ts`

---

## 2. Standard Structure & Boilerplate

Every service must follow this structure:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { RolesCacheService } from '../../iam/roles-cache.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly rolesCacheService: RolesCacheService, // Inject cache if this resource invalidates roles/permissions
    ) { }

    async create(createUserDto: CreateUserDto, companyId: string) {
        // Business logic (e.g. hashing passwords, validation)
        return this.usersRepository.create(createUserDto, companyId);
    }

    async findAll() {
        return this.usersRepository.findAll();
    }

    async findOne(id: string) {
        const user = await this.usersRepository.findOne(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto, companyId: string) {
        const user = await this.findOne(id);
        const result = await this.usersRepository.update(id, updateUserDto, companyId);

        // If updating user roles, invalidate permissions cache
        if (updateUserDto.roleId && user.roleId !== updateUserDto.roleId) {
            this.rolesCacheService.invalidate(user.roleId);
            this.rolesCacheService.invalidate(updateUserDto.roleId);
        }

        return result;
    }

    async delete(id: string) {
        const user = await this.findOne(id);
        const result = await this.usersRepository.delete(id);

        // Invalidate old cache
        if (user.roleId) {
            this.rolesCacheService.invalidate(user.roleId);
        }

        return result;
    }
}
```

---

## 3. Mandatory Best Practices

1. **Decoupling business logic**:
   - Keep controllers thin and repositories focused purely on database queries. The Service layer is where business validation (e.g., checking if email is already taken, verifying constraints) must reside.
2. **Exception Handling**:
   - Throw semantic NestJS HTTP Exceptions (e.g., `NotFoundException`, `ConflictException`, `BadRequestException`, `ForbiddenException`) inside services.
   - Do not let database-specific exceptions bubble directly to the controller; catch and transform them if necessary.
3. **Cache Invalidation**:
   - Every mutation that modifies permissions or roles (e.g. updating a role's permissions or changing a user's role) must explicitly trigger cache invalidation via `rolesCacheService.invalidate(roleId)`.
4. **Transaction Scopes**:
   - For operations touching multiple tables, orchestrate them inside a repository `$transaction` call rather than doing separate service database calls, keeping the database operations atomic.
