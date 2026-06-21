import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesRepository } from './roles.repository';
import { RolesCacheService } from '../../iam/roles-cache.service';

@Injectable()
export class RolesService {
    constructor(
        private readonly rolesRepository: RolesRepository,
        private readonly rolesCacheService: RolesCacheService,
    ) { }

    async create(createRoleDto: CreateRoleDto) {
        return this.rolesRepository.create(createRoleDto);
    }

    async update(id: string, updateRoleDto: UpdateRoleDto, companyId: string) {
        const result = await this.rolesRepository.update(id, updateRoleDto, companyId);
        // Invalidate the cache for this role instantly
        this.rolesCacheService.invalidate(id);
        return result;
    }

    async delete(id: string) {
        const result = await this.rolesRepository.delete(id);
        // Invalidate the cache for this role instantly
        this.rolesCacheService.invalidate(id);
        return result;
    }

    async findAll() {
        return this.rolesRepository.findAll();
    }

    async findOne(id: string) {
        return this.rolesRepository.findOne(id);
    }
}
