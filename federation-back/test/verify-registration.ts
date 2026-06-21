import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Registration Verification ---');

    const newCompanyData = {
        companyName: "Fitness Corp " + Date.now(),
        identificationCode: "123456789",
        sportsDomain: "Fitness",
        legalForm: "ააიპ",
        country: "Georgia",
        legalAddress: "Tbilisi",
        branchName: "Main Branch",
        departmentName: "Management",
        permissions: [
            {
                action: "manage",
                subject: "all"
            }
        ],
        email: `admin${Date.now()}@fitness.com`,
        password: "strongPassword123",
        firstName: "George",
        lastName: "Manager",
        phone: "555-0101",
        personalId: "12345678901",
        position: "Manager"
    };

    try {
        // 1. Make API Request
        console.log('Sending registration request to http://localhost:5005/companies/register...');
        const response = await fetch('http://localhost:5005/companies/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCompanyData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Request Failed with status ${response.status}: ${errorText}`);
            process.exit(1);
        }

        const result = await response.json();
        console.log('API Response:', JSON.stringify(result, null, 2));

        // 2. Verify Database
        console.log('\n--- Verifying Database Records ---');

        console.log('Checking Company...');
        const company = await prisma.company.findFirst({
            where: { name: newCompanyData.companyName },
            include: { branches: true }
        });
        if (!company) throw new Error("Company not found in DB!");
        console.log(`[PASS] Company created: ${company.name} (${company.id})`);

        console.log('Checking Branch...');
        const branch = await prisma.branch.findFirst({
            where: { name: newCompanyData.branchName, companyId: company.id }
        });
        if (!branch) throw new Error("Branch not found or not linked to company!");
        console.log(`[PASS] Branch created: ${branch.name} (${branch.id})`);

        console.log('Checking Department...');
        const department = await prisma.department.findFirst({
            where: { name: newCompanyData.departmentName, branchId: branch.id }
        });
        if (!department) throw new Error("Department not found or not linked to branch!");
        console.log(`[PASS] Department created: ${department.name} (${department.id})`);

        console.log('Checking Role...');
        const role = await prisma.role.findFirst({
            where: { name: result.role.name, departmentId: department.id },
            include: { permissions: true }
        });
        if (!role) throw new Error("Role not found or not linked to department!");
        console.log(`[PASS] Role created: ${role.name} (${role.id})`);
        if (role.permissions.length === 0) throw new Error("Permissions not saved for role!");
        console.log(`[PASS] Permissions saved: ${role.permissions.length} items`);

        console.log('Checking User...');
        const user = await prisma.user.findFirst({
            where: { email: newCompanyData.email, branchId: branch.id, roleId: role.id }
        });
        if (!user) throw new Error("User not found or not linked to branch/role!");
        console.log(`[PASS] User created: ${user.email} (${user.id})`);

        console.log('\n✅ VERIFICATION SUCCESSFUL: All resources created and linked correctly.');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
