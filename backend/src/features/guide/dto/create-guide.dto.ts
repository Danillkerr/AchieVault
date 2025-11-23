import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateGuideRequestDto {
  @IsInt()
  user_id: number;

  @IsString()
  steamId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  text: string;
}
