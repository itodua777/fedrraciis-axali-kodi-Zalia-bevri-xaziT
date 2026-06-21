import { AbilityBuilder, PureAbility, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { User, Permission } from '@prisma/client';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

// Define subjects (add other entities as we go)
export type AppSubjects = 'User' | 'Company' | 'Branch' | 'Department' | 'Role' | 'Permission' | 'StructureUnit' | 'all';

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
