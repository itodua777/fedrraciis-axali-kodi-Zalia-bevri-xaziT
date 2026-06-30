import { IsString, IsOptional } from 'class-validator';

export class UpdateGovernanceUnitDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  parentId?: string | null;
}
