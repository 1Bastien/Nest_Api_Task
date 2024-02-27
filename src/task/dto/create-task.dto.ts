import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  completed: boolean;
}
