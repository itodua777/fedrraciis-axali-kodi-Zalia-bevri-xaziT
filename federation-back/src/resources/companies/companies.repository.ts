import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  async register(dto: RegisterCompanyDto, hashedPassword: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create Company
      const company = await tx.company.create({
        data: {
          name: dto.companyName,
          identificationCode: dto.identificationCode,
          sportsDomain: dto.sportsDomain,
          legalForm: dto.legalForm,
        },
      });

      // 2. Create Branch
      const branch = await tx.branch.create({
        data: {
          name: dto.branchName,
          companyId: company.id,
          country: dto.country,
          legalAddress: dto.legalAddress,
        },
      });

      // 2.5 Create Branch Structure Unit
      const branchUnit = await tx.structureUnit.create({
        data: {
          companyId: company.id,
          name: dto.branchName,
          unitType: 'ფილიალი',
          parentId: null,
        },
      });

      // 3. Create Department
      const department = await tx.department.create({
        data: {
          name: dto.departmentName,
          branchId: branch.id,
          companyId: company.id,
        },
      });

      // 3.5 Create Department Structure Unit
      const deptUnit = await tx.structureUnit.create({
        data: {
          companyId: company.id,
          name: dto.departmentName,
          unitType: 'დეპარტამენტი',
          parentId: branchUnit.id,
        },
      });

      // 4. Create Role with Permissions
      const companyAdmin = 'company_admin';
      const permissionsToCreate = dto.permissions || [
        {
          action: 'manage',
          subject: 'all',
          conditions: null,
          fields: null,
          inverted: false,
        },
      ];
      const role = await tx.role.create({
        data: {
          name: companyAdmin,
          departmentId: department.id,
          companyId: company.id,
          permissions: {
            create: permissionsToCreate.map((p) => ({
              action: p.action,
              subject: p.subject,
              conditions: p.conditions ? JSON.stringify(p.conditions) : null,
              fields: p.fields ? JSON.stringify(p.fields) : null,
              inverted: p.inverted ?? false,
              companyId: company.id,
            })),
          },
        },
      });

      // 5. Create User
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          personalId: dto.personalId,
          position: dto.position,
          branchId: branch.id,
          companyId: company.id,
          roleId: role.id,
          structureUnitId: deptUnit.id,
        },
      });

      return {
        company,
        branch,
        department,
        role,
        user,
      };
    });
  }

  async findById(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        branches: {
          take: 1,
        },
      },
    });
  }

  async update(id: string, data: any) {
    const updateData = { ...data };
    
    // Ensure recognitionDate is parsed into Date object or null
    if (updateData.recognitionDate) {
      updateData.recognitionDate = new Date(updateData.recognitionDate);
    } else if (updateData.recognitionDate === null) {
      updateData.recognitionDate = null;
    }

    return this.prisma.company.update({
      where: { id },
      data: updateData,
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      include: {
        branches: {
          include: {
            departments: {
              include: {
                roles: {
                  include: {
                    users: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
