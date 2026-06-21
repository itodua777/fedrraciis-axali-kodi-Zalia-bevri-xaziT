import { Injectable, NotFoundException } from '@nestjs/common';
import { BranchesRepository } from './branches.repository';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
    constructor(private readonly branchesRepository: BranchesRepository) { }

    async create(createBranchDto: CreateBranchDto, companyId: string) {
        return this.branchesRepository.create(createBranchDto, companyId);
    }

    async findAll() {
        return this.branchesRepository.findAll();
    }

    async findOne(id: string) {
        const branch = await this.branchesRepository.findById(id);
        if (!branch) {
            throw new NotFoundException(`Branch with ID ${id} not found`);
        }
        return branch;
    }

    async update(id: string, updateBranchDto: UpdateBranchDto) {
        await this.findOne(id);
        return this.branchesRepository.update(id, updateBranchDto);
    }

    async delete(id: string) {
        await this.findOne(id);
        return this.branchesRepository.delete(id);
    }
}
