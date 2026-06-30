import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGovernanceUnitDto } from './dto/create-governance-unit.dto';
import { UpdateGovernanceUnitDto } from './dto/update-governance-unit.dto';

@Injectable()
export class GovernanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGovernanceUnitDto, companyId: string) {
    return this.prisma.governanceUnit.create({
      data: {
        name: dto.name,
        parentId: dto.parentId || null,
        companyId,
      },
    });
  }

  async update(id: string, dto: UpdateGovernanceUnitDto) {
    return this.prisma.governanceUnit.update({
      where: { id },
      data: {
        name: dto.name !== undefined ? dto.name : undefined,
        parentId: dto.parentId !== undefined ? dto.parentId : undefined,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.governanceUnit.delete({
      where: { id },
    });
  }

  async findAllByCompany(companyId: string) {
    return this.prisma.governanceUnit.findMany({
      where: { companyId },
    });
  }

  async findById(id: string) {
    return this.prisma.governanceUnit.findUnique({
      where: { id },
    });
  }

  async updateParent(id: string, parentId: string | null) {
    return this.prisma.governanceUnit.update({
      where: { id },
      data: { parentId },
    });
  }
}
