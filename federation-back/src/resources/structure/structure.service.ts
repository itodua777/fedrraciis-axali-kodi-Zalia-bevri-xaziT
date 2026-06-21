import { Injectable, BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { StructureRepository } from './structure.repository';
import { CreateStructureUnitDto } from './dto/create-structure-unit.dto';
import { UpdateStructureUnitDto } from './dto/update-structure-unit.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StructureService implements OnModuleInit {
    constructor(
        private readonly structureRepository: StructureRepository,
        private readonly prisma: PrismaService,
    ) { }

    async onModuleInit() {
        try {
            console.log('[StructureSync] Running structure unit synchronization service...');
            await this.syncStructureUnits();
            console.log('[StructureSync] Structure unit synchronization completed successfully.');
        } catch (err) {
            console.error('[StructureSync] Error during structure unit synchronization:', err);
        }
    }

    async syncStructureUnits() {
        const companies = await this.prisma.company.findMany({
            include: {
                branches: {
                    include: {
                        departments: true,
                    },
                },
                users: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        for (const company of companies) {
            for (const branch of company.branches) {
                // Ensure a StructureUnit exists for this branch
                let branchUnit = await this.prisma.structureUnit.findFirst({
                    where: {
                        companyId: company.id,
                        name: branch.name,
                        unitType: 'ფილიალი',
                    },
                });

                if (!branchUnit) {
                    branchUnit = await this.prisma.structureUnit.create({
                        data: {
                            companyId: company.id,
                            name: branch.name,
                            unitType: 'ფილიალი',
                            parentId: null,
                        },
                    });
                }

                // Ensure a StructureUnit exists for each department under this branch unit
                for (const dept of branch.departments) {
                    let deptUnit = await this.prisma.structureUnit.findFirst({
                        where: {
                            companyId: company.id,
                            name: dept.name,
                            unitType: 'დეპარტამენტი',
                            parentId: branchUnit.id,
                        },
                    });

                    if (!deptUnit) {
                        deptUnit = await this.prisma.structureUnit.create({
                            data: {
                                companyId: company.id,
                                name: dept.name,
                                unitType: 'დეპარტამენტი',
                                parentId: branchUnit.id,
                            },
                        });
                    }
                }

                // Map users of this company in this branch to the correct structure units
                const branchUsers = company.users.filter(u => u.branchId === branch.id);
                for (const user of branchUsers) {
                    if (!user.structureUnitId) {
                        let targetUnitId = branchUnit.id;
                        const deptId = user.role?.departmentId;
                        if (deptId) {
                            const dept = branch.departments.find(d => d.id === deptId);
                            if (dept) {
                                const deptUnit = await this.prisma.structureUnit.findFirst({
                                    where: {
                                        companyId: company.id,
                                        name: dept.name,
                                        unitType: 'დეპარტამენტი',
                                        parentId: branchUnit.id,
                                    },
                                });
                                if (deptUnit) {
                                    targetUnitId = deptUnit.id;
                                }
                            }
                        }

                        await this.prisma.user.update({
                            where: { id: user.id },
                            data: { structureUnitId: targetUnitId },
                        });
                    }
                }
            }
        }
    }

    async create(dto: CreateStructureUnitDto, companyId: string) {
        if (dto.parentId) {
            const parent = await this.structureRepository.findById(dto.parentId);
            if (!parent || parent.companyId !== companyId) {
                throw new BadRequestException('Invalid parent structure unit');
            }
        }
        return this.structureRepository.create(dto, companyId);
    }

    async findTree(companyId: string) {
        const units = await this.structureRepository.findAllByCompany(companyId);
        return this.buildTree(units, null);
    }

    private buildTree(units: any[], parentId: string | null = null): any[] {
        return units
            .filter(u => u.parentId === parentId)
            .map(u => ({
                ...u,
                memberCount: u.users?.length || 0,
                children: this.buildTree(units, u.id),
            }));
    }

    async findOne(id: string, companyId: string) {
        const unit = await this.structureRepository.findById(id);
        if (!unit || unit.companyId !== companyId) {
            throw new NotFoundException(`Structure unit with ID ${id} not found`);
        }
        return unit;
    }

    async update(id: string, dto: UpdateStructureUnitDto, companyId: string) {
        const unit = await this.findOne(id, companyId);
        if (dto.parentId) {
            if (dto.parentId === id) {
                throw new BadRequestException('A unit cannot be its own parent');
            }
            const parent = await this.structureRepository.findById(dto.parentId);
            if (!parent || parent.companyId !== companyId) {
                throw new BadRequestException('Invalid parent structure unit');
            }
            const isDesc = await this.isDescendant(id, dto.parentId);
            if (isDesc) {
                throw new BadRequestException('A unit cannot be moved into one of its own sub-units');
            }
        }
        return this.structureRepository.update(id, dto);
    }

    async delete(id: string, companyId: string) {
        await this.findOne(id, companyId);
        return this.structureRepository.delete(id);
    }

    async moveUnit(draggedId: string, targetId: string | null, companyId: string) {
        const dragged = await this.findOne(draggedId, companyId);
        if (targetId) {
            if (draggedId === targetId) {
                throw new BadRequestException('A unit cannot be moved into itself');
            }
            const target = await this.findOne(targetId, companyId);
            const isDesc = await this.isDescendant(draggedId, targetId);
            if (isDesc) {
                throw new BadRequestException('A unit cannot be moved into one of its own sub-units');
            }
        }
        return this.structureRepository.updateParent(draggedId, targetId);
    }

    private async isDescendant(draggedId: string, targetId: string): Promise<boolean> {
        let currentUnitId: string | null = targetId;
        while (currentUnitId) {
            const unit = await this.structureRepository.findById(currentUnitId);
            if (!unit) break;
            if (unit.parentId === draggedId) {
                return true;
            }
            currentUnitId = unit.parentId;
        }
        return false;
    }

    async assignMember(userId: string, unitId: string | null, companyId: string) {
        const user = await this.structureRepository.findUserById(userId);
        if (!user || user.companyId !== companyId) {
            throw new NotFoundException(`User with ID ${userId} not found in this company`);
        }

        if (unitId) {
            await this.findOne(unitId, companyId); // verify unit exists and belongs to company
        }

        return this.structureRepository.assignMember(userId, unitId);
    }

    async getCompanyUsers(companyId: string) {
        return this.structureRepository.findUsersByCompany(companyId);
    }
}
