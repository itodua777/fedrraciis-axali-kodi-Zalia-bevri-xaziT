import { IsString, IsOptional } from 'class-validator';

export class UpdateStructureUnitDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  unitType?: string;

  @IsString()
  @IsOptional()
  compositionType?: string;

  @IsString()
  @IsOptional()
  termDuration?: string;

  @IsString()
  @IsOptional()
  actNumber?: string;

  @IsString()
  @IsOptional()
  issueDate?: string;

  @IsString()
  @IsOptional()
  parentId?: string;
}
