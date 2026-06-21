import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { RolesService } from '../src/resources/roles/roles.service';
import { RolesCacheService } from '../src/iam/roles-cache.service';
import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    await prisma.$connect();

    console.log('1. Cleaning up database...');
    await prisma.permission.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.department.deleteMany();
    await prisma.branch.deleteMany();
    await prisma.company.deleteMany();

    console.log('2. Seeding test company, branch, department...');
    const company = await prisma.company.create({ data: { name: 'CacheCorp' } });
    const branch = await prisma.branch.create({ data: { name: 'Main Branch', companyId: company.id } });
    const dept = await prisma.department.create({ data: { name: 'IT', branchId: branch.id, companyId: company.id } });

    console.log('3. Initializing NestJS App Context...');
    const app = await NestFactory.createApplicationContext(AppModule);
    const rolesService = app.get(RolesService);
    const rolesCacheService = app.get(RolesCacheService);

    console.log('4. Creating test Role via RolesService...');
    const role = await rolesService.create({
        name: 'Cache Test Role',
        departmentId: dept.id,
        companyId: company.id,
        permissions: [
            { action: 'read', subject: 'User' }
        ]
    });

    console.log(`Created Role ID: ${role.id}`);

    console.log('5. Fetching permissions once (to cache them)...');
    let permissions = await rolesCacheService.getPermissionsForRole(role.id);
    console.log(`- Loaded permissions: ${permissions.length} items (Cache Miss)`);

    // Fetch again to verify cache hit
    console.log('6. Fetching permissions second time (should be cache hit)...');
    permissions = await rolesCacheService.getPermissionsForRole(role.id);
    console.log(`- Loaded permissions: ${permissions.length} items (Cache Hit)`);

    console.log('7. Updating role via RolesService (triggers cache invalidation)...');
    await rolesService.update(role.id, {
        name: 'Updated Cache Test Role',
        permissions: [
            { action: 'read', subject: 'User' },
            { action: 'create', subject: 'User' }
        ]
    }, company.id);

    console.log('8. Verifying cache was invalidated...');
    // We check if the cache Map has deleted the key
    const hasKeyInCache = (rolesCacheService as any).cache.has(role.id);
    if (!hasKeyInCache) {
        console.log('[PASS] Success: Cache was successfully invalidated on update!');
    } else {
        console.error('[FAIL] Error: Cache still contains key after update!');
    }

    console.log('9. Fetching permissions again...');
    permissions = await rolesCacheService.getPermissionsForRole(role.id);
    console.log(`- Loaded updated permissions: ${permissions.length} items (Should be 2)`);
    if (permissions.length === 2) {
        console.log('[PASS] Success: Loaded new permissions correctly!');
    } else {
        console.error(`[FAIL] Error: Expected 2 permissions, got ${permissions.length}`);
    }

    console.log('10. Deleting role via RolesService...');
    await rolesService.delete(role.id);

    console.log('11. Verifying cache was invalidated on delete...');
    const hasKeyInCacheAfterDelete = (rolesCacheService as any).cache.has(role.id);
    if (!hasKeyInCacheAfterDelete) {
        console.log('[PASS] Success: Cache was successfully invalidated on delete!');
    } else {
        console.error('[FAIL] Error: Cache still contains key after delete!');
    }

    await app.close();
    await prisma.$disconnect();
    console.log('--- Cache Invalidation Test Completed ---');
}

main().catch(console.error);
