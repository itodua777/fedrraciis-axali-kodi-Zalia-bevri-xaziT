import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Permission } from '@prisma/client';

@Injectable()
export class RolesCacheService {
  private readonly cache = new Map<string, Permission[]>();

  constructor(private readonly prisma: PrismaService) {}

  async getPermissionsForRole(roleId: string): Promise<Permission[]> {
    if (!roleId) return [];

    if (this.cache.has(roleId)) {
      return this.cache.get(roleId)!;
    }

    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: { permissions: true },
    });
    const permissions = role?.permissions || [];
    
    this.cache.set(roleId, permissions);
    return permissions;
  }

  invalidate(roleId: string): void {
    this.cache.delete(roleId);
  }

  clear(): void {
    this.cache.clear();
  }
}
