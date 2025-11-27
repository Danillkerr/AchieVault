import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsInt,
  MinLength,
  ArrayMinSize,
} from 'class-validator';

export class CreateRoadmapDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  gameIds: number[];
}
