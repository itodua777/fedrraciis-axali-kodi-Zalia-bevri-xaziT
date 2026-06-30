import { IsString, IsOptional, IsBoolean, IsDateString, IsEmail } from 'class-validator';

export class UpdateCompanyProfileDto {
  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  facebook?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsEmail()
  @IsOptional()
  publicEmail?: string;


  @IsBoolean()
  @IsOptional()
  isMinistryRecognized?: boolean;

  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @IsDateString()
  @IsOptional()
  recognitionDate?: string;

  @IsString()
  @IsOptional()
  legalForm?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;
}
