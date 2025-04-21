import { IsString, IsInt, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(64)
  name: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

export class UpdateCategoryDto {
  @IsString()
  @MaxLength(64)
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}
