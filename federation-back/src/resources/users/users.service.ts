import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { HashingService } from 'src/authentication/hashing/hashing.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesCacheService } from '../../iam/roles-cache.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly hashingService: HashingService,
        private readonly rolesCacheService: RolesCacheService,
    ) { }

    async create(createUserDto: CreateUserDto, companyId: string) {
        // Check if user exists
        const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await this.hashingService.hash(createUserDto.password);

        const userToCreate = {
            ...createUserDto,
            password: hashedPassword,
        };

        const user = await this.usersRepository.create(userToCreate, companyId);

        // Return without password
        const { password, ...result } = user;
        return result;
    }

    async findAll() {
        const users = await this.usersRepository.findAll();
        return users.map(({ password, ...user }) => user);
    }

    async findOne(id: string) {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        const { password, ...result } = user;
        return result;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        const dataToUpdate: UpdateUserDto = { ...updateUserDto };

        // Hash password if modified
        if (updateUserDto.password) {
            dataToUpdate.password = await this.hashingService.hash(updateUserDto.password);
        }

        const updatedUser = await this.usersRepository.update(id, dataToUpdate);

        // If the user's role was changed, invalidate old cache
        if (updateUserDto.roleId && user.roleId !== updateUserDto.roleId) {
            if (user.roleId) this.rolesCacheService.invalidate(user.roleId);
            this.rolesCacheService.invalidate(updateUserDto.roleId);
        }

        const { password, ...result } = updatedUser;
        return result;
    }

    async delete(id: string) {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        const deletedUser = await this.usersRepository.delete(id);

        // Invalidate old cache
        if (user.roleId) {
            this.rolesCacheService.invalidate(user.roleId);
        }

        const { password, ...result } = deletedUser;
        return result;
    }
}
