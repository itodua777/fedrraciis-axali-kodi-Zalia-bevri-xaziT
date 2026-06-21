export interface JwtPayload {
  companyId: string;
  companyName?: string;
  branchId: string | null;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  isSuperUser: boolean;
  position?: string | null;
  iat?: number;
  exp?: number;
}
