# Prisma Schema & Database Design Standards

Our database schema is built using PostgreSQL and Prisma, taking advantage of Prisma's multi-schema feature to organize models into individual, logical schema files.

---

## 1. Directory Structure

Schema files are located in:
`prisma/schema/`

Every resource should have its own `.prisma` file. For example:
- `prisma/schema/user.prisma`
- `prisma/schema/company.prisma`
- `prisma/schema/access_control.prisma`

All schemas are merged and validated using the CLI:
`npx prisma validate`
`npx prisma generate`

---

## 2. Standard Schema Template (Tenant-Scoped Model)

Every tenant-scoped model must follow this structure:

```prisma
model Department {
  id        String   @id @default(uuid()) @db.Uuid
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Tenant Boundary
  companyId String   @db.Uuid
  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  // Relationships
  branchId  String   @db.Uuid
  branch    Branch   @relation(fields: [branchId], references: [id], onDelete: Cascade)
  roles     Role[]

  @@map("departments") // Map to lowercase plural name in PostgreSQL
}
```

---

## 3. Mandatory Best Practices

1. **Tenant Isolation Column (`companyId`)**:
   - Every tenant-specific table (e.g., `User`, `Branch`, `Department`, `Role`, `Permission`, and any future operational entities) **MUST** contain a `companyId` column referencing `Company(id)`.
   - The relationship must be set to `onDelete: Cascade` so that deleting a company cleans up all tenant data automatically.
2. **Naming Conventions**:
   - Models must use `PascalCase` and singular names (e.g., `Department`, `UserRole`).
   - Use the `@@map("table_name")` decorator to maps models to lowercase, plural, snake_case table names in PostgreSQL (e.g., `@@map("user_roles")`).
   - Field names must be camelCase (e.g., `companyId`, `createdAt`).
3. **Database Types & Primary Keys**:
   - Use `String @id @default(uuid()) @db.Uuid` for primary keys. UUIDs prevent ID scanning attacks.
   - Use correct SQL types (e.g., `@db.Uuid` for identifiers, `@db.JsonB` for dynamic structures).
4. **Foreign Key Indexing**:
   - Place indexes `@@index([companyId])` or unique constraints `@@unique([name, companyId])` on lookups to speed up query execution and enforce logical integrity within a single tenant.
5. **No Orphan Cascades**:
   - Never allow soft-deletes or deletion mechanisms to bypass cascade constraints, keeping the database free of orphaned references.
