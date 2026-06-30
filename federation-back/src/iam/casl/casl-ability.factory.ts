import { AbilityBuilder, PureAbility, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { User, Permission } from '@prisma/client';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

// Define subjects (add other entities as we go)
export type AppSubjects = 'User' | 'Company' | 'Branch' | 'Department' | 'Role' | 'Permission' | 'RolePermission' | 'StructureUnit' | 'GovernanceUnit' | 'Founder' | 'all';

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(
        user: ActiveUserData | (User & { role?: { permissions: Permission[] } | null }),
        customPermissions?: Permission[],
    ) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

        // 1. SuperUser bypass
        if (user.isSuperUser) {
            can('manage', 'all');
            return build();
        }

        if (user.companyId) {
            can('manage', 'GovernanceUnit');
            can('manage', 'Founder');
        }

        // 1b. Force-bypass structure/roles permissions for organization owners / primary creators
        const isOwner = (user as any).isOwner || 
                        (user as any).roleName === 'company_admin' || 
                        (user as any).role?.name === 'company_admin';

        if (user.companyId && isOwner) {
            // Complete unrestricted access within own organization
            can('manage', 'StructureUnit', { companyId: user.companyId } as any);
            can('manage', 'RolePermission', { companyId: user.companyId } as any);
            can('manage', 'Role', { companyId: user.companyId } as any);
            can('manage', 'User', { companyId: user.companyId } as any);
            can('manage', 'Department', { companyId: user.companyId } as any);
            can('manage', 'Branch', { companyId: user.companyId } as any);
            can('manage', 'Company', { id: user.companyId } as any);
            can('manage', 'Founder', { companyId: user.companyId } as any);

            // Also grant general permissions so type-based checks pass
            can('manage', 'StructureUnit');
            can('manage', 'RolePermission');
            can('manage', 'Role');
            can('manage', 'User');
            can('manage', 'Department');
            can('manage', 'Branch');
            can('manage', 'Company');
            can('manage', 'Founder');
        } else if (user.companyId) {
            // General local organization manager defaults
            can('create', 'StructureUnit');
            can('read', 'StructureUnit');
            can('update', 'StructureUnit');
            can('delete', 'StructureUnit');
            can('read', 'User');
            can('update', 'User');
        }

        // 2. Resolve permissions list
        let permissions: Permission[] = [];
        if (customPermissions) {
            permissions = customPermissions;
        } else if ('role' in user && user.role && user.role.permissions) {
            permissions = user.role.permissions;
        }

        permissions.forEach((permission) => {
            const action = permission.action;
            const subject = permission.subject as AppSubjects;
            
            let conditions: PrismaQuery | undefined = undefined;
            if (permission.conditions) {
                try {
                    conditions = typeof permission.conditions === 'string'
                        ? JSON.parse(permission.conditions)
                        : permission.conditions;
                } catch (e) {
                    console.error('Failed to parse permission conditions', permission.conditions, e);
                }
            }

            let fields: string[] | undefined = undefined;
            if (permission.fields) {
                try {
                    fields = typeof permission.fields === 'string'
                        ? JSON.parse(permission.fields)
                        : permission.fields;
                } catch (e) {
                    console.error('Failed to parse permission fields', permission.fields, e);
                }
            }

            if (permission.inverted) {
                if (fields) {
                    cannot(action, subject, fields, conditions as any);
                } else {
                    cannot(action, subject, conditions as any);
                }
            } else {
                if (fields) {
                    can(action, subject, fields, conditions as any);
                } else {
                    can(action, subject, conditions as any);
                }
            }
        });

        return build();
    }
}
