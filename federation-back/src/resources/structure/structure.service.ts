import { Injectable, BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { StructureRepository } from './structure.repository';
import { CreateStructureUnitDto } from './dto/create-structure-unit.dto';
import { UpdateStructureUnitDto } from './dto/update-structure-unit.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { HashingService } from '../../authentication/hashing/hashing.service';

@Injectable()
export class StructureService implements OnModuleInit {
    constructor(
        private readonly structureRepository: StructureRepository,
        private readonly prisma: PrismaService,
        private readonly hashingService: HashingService,
    ) { }

    async onModuleInit() {
        // Deprecated: Hierarchy synchronization disabled
        console.log('[StructureSync] Flat roles active. Hierarchical sync bypassed.');
    }

    async create(dto: CreateStructureUnitDto, companyId: string) {
        return this.structureRepository.create({
            ...dto,
            parentId: undefined,
            unitType: 'თანამდებობა/საშტატო ერთეული',
        }, companyId);
    }

    async findTree(companyId: string, currentUserEmail?: string) {
        const unitCount = await this.prisma.structureUnit.count({ where: { companyId } });
        if (unitCount === 0) {
            await this.prisma.structureUnit.create({
                data: {
                    companyId,
                    name: 'ადმინისტრატორი',
                    unitType: 'თანამდებობა/საშტატო ერთეული',
                    parentId: null
                }
            });
        }

        const units = await this.structureRepository.findAllByCompany(companyId);

        return units.map(u => ({
            id: u.id,
            companyId: u.companyId,
            name: u.name,
            unitType: 'თანამდებობა/საშტატო ერთეული',
            compositionType: u.compositionType,
            termDuration: u.termDuration,
            actNumber: u.actNumber,
            issueDate: u.issueDate,
            parentId: null,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            users: u.users || [],
            memberCount: u.users?.length || 0,
            permissions: u.permissions || [],
            children: []
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
        await this.findOne(id, companyId);
        return this.structureRepository.update(id, {
            ...dto,
            parentId: undefined,
            unitType: 'თანამდებობა/საშტატო ერთეული'
        });
    }

    async delete(id: string, companyId: string) {
        await this.findOne(id, companyId);
        return this.structureRepository.delete(id);
    }

    async moveUnit(draggedId: string, targetId: string | null, companyId: string) {
        // Deprecated: Hierarchy reparenting disabled
        return { success: true };
    }

    async assignMember(userId: string, unitId: string | null, companyId: string) {
        const user = await this.structureRepository.findUserById(userId);
        if (!user || user.companyId !== companyId) {
            throw new NotFoundException(`User with ID ${userId} not found in this company`);
        }

        if (unitId) {
            await this.findOne(unitId, companyId);
        }

        return this.structureRepository.assignMember(userId, unitId);
    }

    async getCompanyUsers(companyId: string) {
        return this.structureRepository.findUsersByCompany(companyId);
    }

    async updatePermissions(id: string, permissions: any, companyId: string) {
        await this.findOne(id, companyId);

        const permissionsArray: {
            module: string;
            create: boolean;
            read: boolean;
            update: boolean;
            delete: boolean;
            fullControl: boolean;
        }[] = [];

        if (Array.isArray(permissions)) {
            permissionsArray.push(...permissions);
        } else if (permissions && typeof permissions === 'object') {
            Object.entries(permissions).forEach(([module, flags]: [string, any]) => {
                permissionsArray.push({
                    module,
                    create: !!flags.create,
                    read: !!flags.read,
                    update: !!flags.update,
                    delete: !!flags.delete,
                    fullControl: !!flags.fullControl,
                });
            });
        }

        await this.prisma.$transaction([
            this.prisma.rolePermission.deleteMany({
                where: { structureUnitId: id },
            }),
            this.prisma.rolePermission.createMany({
                data: permissionsArray.map((p) => ({
                    structureUnitId: id,
                    module: p.module.toLowerCase(),
                    create: p.create,
                    read: p.read,
                    update: p.update,
                    delete: p.delete,
                    fullControl: p.fullControl,
                })),
            }),
        ]);

        return this.findOne(id, companyId);
    }

    async saveMemberAndPermissions(
        unitId: string,
        memberDto: any,
        permissionsDto: any,
        companyId: string,
        currentUser: any,
    ) {
        // 1. Verify structure unit exists and belongs to the company
        const unit = await this.findOne(unitId, companyId);

        // 2. Perform database transaction
        return await this.prisma.$transaction(async (tx) => {
            // a. Save/Update permissions
            const permissionsArray: any[] = [];
            if (permissionsDto && typeof permissionsDto === 'object') {
                Object.entries(permissionsDto).forEach(([module, flags]: [string, any]) => {
                    permissionsArray.push({
                        structureUnitId: unitId,
                        module: module.toLowerCase(),
                        create: !!flags.create,
                        read: !!flags.read,
                        update: !!flags.update,
                        delete: !!flags.delete,
                        fullControl: !!flags.fullControl,
                    });
                });
            }

            await tx.rolePermission.deleteMany({
                where: { structureUnitId: unitId },
            });

            if (permissionsArray.length > 0) {
                await tx.rolePermission.createMany({
                    data: permissionsArray,
                });
            }

            // b. Save/Update member if provided
            if (memberDto && memberDto.firstName && memberDto.lastName && memberDto.email) {
                let user;
                
                // Find if user already exists (either by id or by email)
                if (memberDto.id) {
                    user = await tx.user.findFirst({ where: { id: memberDto.id, isDeleted: false } });
                } else {
                    user = await tx.user.findFirst({ where: { email: memberDto.email, isDeleted: false } });
                }

                if (user) {
                    // Update existing user
                    user = await tx.user.update({
                        where: { id: user.id },
                        data: {
                            firstName: memberDto.firstName,
                            lastName: memberDto.lastName,
                            personalId: memberDto.personalId,
                            address: memberDto.address || null,
                            phone: memberDto.phone || null,
                            email: memberDto.email,
                            bio: memberDto.bio || null,
                            photo: memberDto.photo || null,
                            structureUnitId: unitId, // bind to role
                            position: unit.name,      // set position name to role name
                        },
                    });
                } else {
                    // Create new user
                    // We need a password and branchId.
                    // Let's get the active user's branchId so they belong to the same branch.
                    const branchId = currentUser?.branchId || (await tx.branch.findFirst({ where: { companyId } }))?.id;
                    if (!branchId) {
                        throw new BadRequestException('Branch not found to assign user');
                    }

                    // Hash default password
                    const hashedPassword = await this.hashingService.hash('Password123!');

                    user = await tx.user.create({
                        data: {
                            email: memberDto.email,
                            password: hashedPassword,
                            firstName: memberDto.firstName,
                            lastName: memberDto.lastName,
                            phone: memberDto.phone || null,
                            personalId: memberDto.personalId,
                            address: memberDto.address || null,
                            bio: memberDto.bio || null,
                            photo: memberDto.photo || null,
                            position: unit.name,
                            companyId,
                            branchId,
                            structureUnitId: unitId,
                        },
                    });
                }
            }

            return { success: true };
        });
    }
}
