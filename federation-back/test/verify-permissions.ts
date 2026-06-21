import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { CaslAbilityFactory } from '../src/iam/casl/casl-ability.factory';

async function main() {
    const prisma = new PrismaClient();
    await prisma.$connect();
    const abilityFactory = new CaslAbilityFactory();

    console.log('1. Connecting to DB...');
    // Clean up
    await prisma.permission.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.department.deleteMany();
    await prisma.branch.deleteMany();
    await prisma.company.deleteMany();

    console.log('2. Creating Hierarchy...');
    const company = await prisma.company.create({ data: { name: 'FitCorp' } });
    const branch = await prisma.branch.create({ data: { name: 'Main Branch', companyId: company.id } });
    const dept = await prisma.department.create({ data: { name: 'IT', branchId: branch.id, companyId: company.id } });

    console.log('3. Creating Role with Permissions...');
    // Create a role that can READ USERS but CANNOT READ PHONE field
    const role = await prisma.role.create({
        data: {
            name: 'Limited Admin',
            departmentId: dept.id,
            companyId: company.id,
            permissions: {
                create: [
                    { action: 'read', subject: 'User', companyId: company.id }, // Can read User
                    { action: 'read', subject: 'User', fields: JSON.stringify(['phone']), inverted: true, companyId: company.id } // Cannot read User.phone
                ]
            }
        },
        include: { permissions: true } // Important to include for factory
    });

    console.log('4. Creating User...');
    const user = await prisma.user.create({
        data: {
            email: 'admin@fitcorp.com',
            password: 'hashedpassword',
            firstName: 'John',
            lastName: 'Doe',
            branchId: branch.id,
            roleId: role.id,
            companyId: company.id
        },
        include: { role: { include: { permissions: true } } }
    });

    console.log('5. Testing CASL Ability...');
    const ability = abilityFactory.createForUser(user);

    const canReadUser = ability.can('read', 'User');
    const canReadPhone = ability.can('read', 'User', 'phone');

    console.log(`- Can Read User? ${canReadUser}`);
    console.log(`- Can Read User Phone? ${canReadPhone}`);

    if (canReadUser && !canReadPhone) {
        console.log('SUCCESS: Permissions are working as expected!');
    } else {
        console.error('FAILURE: Permissions mismatch.');
    }

    await prisma.$disconnect();
}

main().catch(console.error);
