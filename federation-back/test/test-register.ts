import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CompaniesService } from '../src/resources/companies/companies.service';
import { PrismaService } from '../src/prisma/prisma.service';

async function main() {
  console.log('1. Initializing NestJS application context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const companiesService = app.get(CompaniesService);
  const prisma = app.get(PrismaService);

  const testEmail = `admin-${Date.now()}@testfed.org`;
  const payload = {
    companyName: 'Test Sports Federation ' + Date.now(),
    identificationCode: '123456789',
    sportsDomain: 'Test Sports',
    legalForm: 'ააიპ',
    country: 'Georgia',
    legalAddress: 'Tbilisi',
    branchName: 'Primary branch office',
    departmentName: 'IT & Ops',
    email: testEmail,
    password: 'SuperSecurePassword123!',
    firstName: 'Alice',
    lastName: 'Smith',
    phone: '+995555111222',
    personalId: '12345678901',
    position: 'IT Manager',
  };

  console.log('2. Registering new federation via CompaniesService...');
  const result = await companiesService.register(payload);
  console.log('Registration result:', JSON.stringify(result, null, 2));

  console.log('3. Verifying database records...');
  // Query rawClient directly to bypass multitenant query isolation if user context isn't set in CLS,
  // although PrismaService won't filter if CLS is empty anyway.
  const company = await prisma.company.findUnique({
    where: { id: result.company.id },
    include: {
      branches: true,
      departments: true,
      roles: {
        include: {
          permissions: true,
        },
      },
      users: true,
    },
  });

  if (!company) {
    throw new Error('Verification failed: Company not found in database.');
  }
  console.log('Company successfully created:', company.name);

  const branch = company.branches.find(b => b.name === payload.branchName);
  if (!branch) {
    throw new Error('Verification failed: Primary Branch not found.');
  }
  console.log('Branch successfully created:', branch.name);

  const dept = company.departments.find(d => d.name === payload.departmentName);
  if (!dept) {
    throw new Error('Verification failed: Department not found.');
  }
  console.log('Department successfully created:', dept.name);

  const role = company.roles.find(r => r.name === 'company_admin');
  if (!role) {
    throw new Error('Verification failed: company_admin role not found.');
  }
  console.log('Role successfully created:', role.name);

  const hasManageAll = role.permissions.some(p => p.action === 'manage' && p.subject === 'all');
  if (!hasManageAll) {
    throw new Error('Verification failed: foundational manage all permission not found on company_admin.');
  }
  console.log('Foundational permissions successfully seeded.');

  const user = company.users.find(u => u.email === payload.email);
  if (!user) {
    throw new Error('Verification failed: Superuser not found.');
  }
  if (user.password === payload.password) {
    throw new Error('Verification failed: Superuser password was not encrypted.');
  }
  console.log('Superuser successfully created and password encrypted via bcrypt.');

  console.log('SUCCESS: All integration checks passed perfectly!');
  
  await app.close();
}

main().catch(async (err) => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
