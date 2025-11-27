import { IsEnum, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum LibrarySort {
  PLAYTIME = 'playtime',
  NAME = 'name',
}

export class GetUserLibraryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 20;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(LibrarySort)
  @IsOptional()
  sortBy?: LibrarySort = LibrarySort.PLAYTIME;
}
