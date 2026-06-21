import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStructureUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  unitType: string;

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
