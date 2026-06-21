import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsUUID()
    @IsOptional() // Optional so normal tenant admins don't have to specify it
    companyId?: string;

    @IsUUID()
    @IsNotEmpty()
    branchId: string;

    @IsUUID()
    @IsOptional()
    roleId?: string;
}
