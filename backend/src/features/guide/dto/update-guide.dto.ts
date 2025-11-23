import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateGuideDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  text: string;
}
