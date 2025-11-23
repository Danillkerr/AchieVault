import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetGuidesQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 10;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  userId?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  gameId?: number;
}
