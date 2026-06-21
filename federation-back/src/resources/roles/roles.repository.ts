import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(createRoleDto: CreateRoleDto) {
        const { permissions, ...roleData } = createRoleDto;

        return this.prisma.role.create({
            data: {
                ...roleData,
                permissions: {
                    create: permissions.map((p) => ({
                        action: p.action,
                        subject: p.subject,
                        conditions: p.conditions ? JSON.stringify(p.conditions) : null,
                        fields: p.fields ? JSON.stringify(p.fields) : null,
                        inverted: p.inverted ?? false,
                        companyId: roleData.companyId,
                    })),
                },
            },
            include: {
                permissions: true,
            },
        });
    }

    async update(id: string, updateRoleDto: UpdateRoleDto, companyId: string) {
        const { permissions, ...roleData } = updateRoleDto;

        return this.prisma.$transaction(async (tx) => {
            const role = await tx.role.update({
                where: { id },
                data: roleData,
            });

            if (permissions) {
                await tx.permission.deleteMany({
                    where: { roleId: id },
                });

                if (permissions.length > 0) {
                    await tx.permission.createMany({
                        data: permissions.map((p) => ({
                            action: p.action,
                            subject: p.subject,
                            conditions: p.conditions ? JSON.stringify(p.conditions) : null,
                            fields: p.fields ? JSON.stringify(p.fields) : null,
                            inverted: p.inverted ?? false,
                            roleId: id,
                            companyId: companyId,
                        })),
                    });
                }
            }

            return tx.role.findUnique({
                where: { id },
                include: { permissions: true },
            });
        });
    }

    async delete(id: string) {
        return this.prisma.role.delete({
            where: { id },
        });
    }

    async findAll() {
        return this.prisma.role.findMany({ include: { permissions: true } });
    }

    async findOne(id: string) {
        return this.prisma.role.findUnique({
            where: { id },
            include: { permissions: true },
        });
    }
}
