# Repository Layer Standards

Repositories serve as the data access abstraction layer. They handle queries to the database via `PrismaService`, transaction management, and low-level entity mappings.

---

## 1. Directory Structure

Repositories must be located inside their resource folder:
`src/resources/<resource-name>/<resource-name>.repository.ts`

---

## 2. Standard Structure & Boilerplate

Every repository must follow this structure:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto, companyId: string) {
        return this.prisma.user.create({
            data: {
                ...createUserDto,
                companyId, // Explicitly pass companyId
            },
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto, companyId: string) {
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }

    async delete(id: string) {
        return this.prisma.user.delete({
            where: { id },
        });
    }

    async findAll() {
        return this.prisma.user.findMany();
    }

    async findOne(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
}
```

---

## 3. Mandatory Best Practices

1. **Explicit vs Implicit Tenant Scoping**:
   - For all **read** operations (`findUnique`, `findFirst`, `findMany`, `count`, etc.) and **bulk write** operations (`updateMany`, `deleteMany`), `PrismaService` middleware automatically appends `{ companyId: user.companyId }` filtering.
   - For **creation** (`create`, `createMany`), always pass `companyId` explicitly in the payload to ensure correct scoping.
   - For **updates and deletions** (`update`, `delete`), the custom `PrismaService` middleware validates tenant ownership. However, repositories must never try to bypass this security check.
2. **Atomic Transactions (`$transaction`)**:
   - When updating data across multiple related entities, use `this.prisma.$transaction(async (tx) => { ... })`.
   - Always run inner operations using the transaction context parameter `tx`, not the standard `this.prisma` instance (otherwise, operations run outside the transaction!).
3. **Relation Mapping**:
   - Use `include` options selectively to fetch required relationships.
   - Avoid over-fetching nested relations unless strictly necessary for business logic. Keep database transactions light.
