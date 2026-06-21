import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(createDepartmentDto: CreateDepartmentDto, companyId: string) {
        return this.prisma.department.create({
            data: {
                ...createDepartmentDto,
                companyId,
            },
        });
    }

    async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
        return this.prisma.department.update({
            where: { id },
            data: updateDepartmentDto,
        });
    }

    async delete(id: string) {
        return this.prisma.department.delete({
            where: { id },
        });
    }

    async findAll() {
        return this.prisma.department.findMany({
            include: { branch: true, roles: true },
        });
    }

    async findById(id: string) {
        return this.prisma.department.findUnique({
            where: { id },
            include: { branch: true, roles: true },
        });
    }
}
