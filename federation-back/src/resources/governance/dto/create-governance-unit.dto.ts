import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGovernanceUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  parentId?: string;
}
