import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentsRepository } from './departments.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
    constructor(private readonly departmentsRepository: DepartmentsRepository) { }

    async create(createDepartmentDto: CreateDepartmentDto, companyId: string) {
        return this.departmentsRepository.create(createDepartmentDto, companyId);
    }

    async findAll() {
        return this.departmentsRepository.findAll();
    }

    async findOne(id: string) {
        const department = await this.departmentsRepository.findById(id);
        if (!department) {
            throw new NotFoundException(`Department with ID ${id} not found`);
        }
        return department;
    }

    async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
        await this.findOne(id);
        return this.departmentsRepository.update(id, updateDepartmentDto);
    }

    async delete(id: string) {
        await this.findOne(id);
        return this.departmentsRepository.delete(id);
    }
}
