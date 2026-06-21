export interface ActiveUserData {
    userId: string;
    email: string;
    companyId: string;
    branchId: string | null;
    roleId: string;
    isSuperUser: boolean;
}
