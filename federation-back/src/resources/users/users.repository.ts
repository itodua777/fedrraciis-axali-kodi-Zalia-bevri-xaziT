import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto, companyId: string) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        companyId,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email, isDeleted: false },
      include: {
        company: true,
        branch: true,
        role: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { isDeleted: false },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findFirst({
      where: { id, isDeleted: false },
      include: {
        company: true,
        branch: true,
        role: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async delete(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }
}
