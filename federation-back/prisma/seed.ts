import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // 1. Clean up existing seed data if any
  const existingSuperUser = await prisma.user.findFirst({
    where: { email: 'superadmin@fitnet.com' },
  });

  if (existingSuperUser) {
    console.log('SuperAdmin user already exists. Skipping seed.');
    return;
  }

  // 2. Encrypt default administrator password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash('SuperSecurePassword123!', salt);

  console.log('Seeding default system HQ company, branch, and department...');
  
  // 3. Create HQ Company
  const hqCompany = await prisma.company.create({
    data: {
      name: 'Fitness SaaS Headquarters',
    },
  });

  // 4. Create HQ Branch
  const hqBranch = await prisma.branch.create({
    data: {
      name: 'Main HQ',
      companyId: hqCompany.id,
    },
  });

  // 5. Create HQ Department
  const hqDepartment = await prisma.department.create({
    data: {
      name: 'System Administration',
      branchId: hqBranch.id,
      companyId: hqCompany.id,
    },
  });

  // 6. Create Super Admin Role with global manage-all permission
  console.log('Seeding default SuperAdmin Role and permissions...');
  const superAdminRole = await prisma.role.create({
    data: {
      name: 'super_admin_role',
      departmentId: hqDepartment.id,
      companyId: hqCompany.id,
      permissions: {
        create: [
          {
            action: 'manage',
            subject: 'all',
            companyId: hqCompany.id,
          },
        ],
      },
    },
  });

  // 7. Create Super Admin User
  console.log('Seeding default SuperAdmin user...');
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@fitnet.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+995555123456',
      branchId: hqBranch.id,
      companyId: hqCompany.id,
      roleId: superAdminRole.id,
      isSuperUser: true,
      isActive: true,
    },
  });

  console.log('Seeding completed successfully!');
  console.log('--------------------------------------------------');
  console.log(`SuperAdmin Email:    ${superAdmin.email}`);
  console.log(`SuperAdmin Password: SuperSecurePassword123!`);
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
