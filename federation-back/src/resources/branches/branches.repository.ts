import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(createBranchDto: CreateBranchDto, companyId: string) {
        return this.prisma.branch.create({
            data: {
                ...createBranchDto,
                companyId,
            },
        });
    }

    async update(id: string, updateBranchDto: UpdateBranchDto) {
        return this.prisma.branch.update({
            where: { id },
            data: updateBranchDto,
        });
    }

    async delete(id: string) {
        return this.prisma.branch.delete({
            where: { id },
        });
    }

    async findAll() {
        return this.prisma.branch.findMany({ include: { departments: true } });
    }

    async findById(id: string) {
        return this.prisma.branch.findUnique({
            where: { id },
            include: { departments: true },
        });
    }
}
