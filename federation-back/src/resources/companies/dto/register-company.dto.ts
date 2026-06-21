import { IsNotEmpty, IsString, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePermissionDto } from '../../roles/dto/create-role.dto';

export class RegisterCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  identificationCode: string;

  @IsString()
  @IsNotEmpty()
  sportsDomain: string;

  @IsString()
  @IsNotEmpty()
  legalForm: string;

  @IsString()
  @IsNotEmpty()
  branchName: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  legalAddress: string;

  @IsString()
  @IsNotEmpty()
  departmentName: string;

  // @IsString()
  // @IsNotEmpty()
  // roleName: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePermissionDto)
  permissions?: CreatePermissionDto[];

  // User Fields
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  personalId: string;

  @IsString()
  @IsNotEmpty()
  position: string;
}
