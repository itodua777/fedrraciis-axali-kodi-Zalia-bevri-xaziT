import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsJSON, ValidateNested, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    action: string;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsOptional()
    conditions?: any; // Validated as JSON or object at runtime? simpler to accept object and let Prisma handle JSON

    @IsOptional()
    fields?: any;

    @IsBoolean()
    @IsOptional()
    inverted?: boolean;
}

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    departmentId: string;

    @IsUUID()
    @IsNotEmpty()
    companyId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePermissionDto)
    permissions: CreatePermissionDto[];
}
