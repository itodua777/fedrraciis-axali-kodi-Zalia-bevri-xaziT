import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateFounderDto {
  @IsNotEmpty()
  @IsString()
  type: 'INDIVIDUAL' | 'LEGAL_ENTITY';

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  personalId?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companyCode?: string;

  @IsOptional()
  @IsString()
  representativeName?: string;

  @IsOptional()
  @IsString()
  representativePersonalId?: string;

  @IsOptional()
  @IsBoolean()
  isActiveMember?: boolean;

  @IsOptional()
  @IsBoolean()
  hasVotingRight?: boolean;
}
