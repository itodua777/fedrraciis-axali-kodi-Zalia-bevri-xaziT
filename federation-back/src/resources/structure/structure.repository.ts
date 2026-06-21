import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStructureUnitDto } from './dto/create-structure-unit.dto';
import { UpdateStructureUnitDto } from './dto/update-structure-unit.dto';

@Injectable()
export class StructureRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateStructureUnitDto, companyId: string) {
        return this.prisma.structureUnit.create({
            data: {
                name: dto.name,
                unitType: dto.unitType,
                compositionType: dto.compositionType || null,
                termDuration: dto.termDuration || null,
                actNumber: dto.actNumber || null,
                issueDate: dto.issueDate || null,
                parentId: dto.parentId || null,
                companyId,
            },
        });
    }

    async update(id: string, dto: UpdateStructureUnitDto) {
        return this.prisma.structureUnit.update({
            where: { id },
            data: {
                name: dto.name,
                unitType: dto.unitType,
                compositionType: dto.compositionType !== undefined ? dto.compositionType : undefined,
                termDuration: dto.termDuration !== undefined ? dto.termDuration : undefined,
                actNumber: dto.actNumber !== undefined ? dto.actNumber : undefined,
                issueDate: dto.issueDate !== undefined ? dto.issueDate : undefined,
                parentId: dto.parentId !== undefined ? dto.parentId : undefined,
            },
        });
    }

    async delete(id: string) {
        return this.prisma.structureUnit.delete({
            where: { id },
        });
    }

    async findAllByCompany(companyId: string) {
        return this.prisma.structureUnit.findMany({
            where: { companyId },
            include: {
                users: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        position: true,
                    },
                },
            },
        });
    }

    async findById(id: string) {
        return this.prisma.structureUnit.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        position: true,
                    },
                },
            },
        });
    }

    async updateParent(id: string, parentId: string | null) {
        return this.prisma.structureUnit.update({
            where: { id },
            data: { parentId },
        });
    }

    async assignMember(userId: string, structureUnitId: string | null) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { structureUnitId },
        });
    }

    async findUserById(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }

    async findUsersByCompany(companyId: string) {
        return this.prisma.user.findMany({
            where: { companyId, isDeleted: false },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                position: true,
                structureUnitId: true,
            },
        });
    }
}
