import { SetMetadata } from '@nestjs/common';

export interface RequiredPermission {
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'fullControl';
}

export const CHECK_PERMISSIONS_KEY = 'check_permissions';

export const CheckPermissions = (
  module: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'fullControl',
) => SetMetadata(CHECK_PERMISSIONS_KEY, { module, action } as RequiredPermission);
