import { IsOptional, IsString } from 'class-validator';

export class RequestActionDto {
  @IsOptional()
  @IsString()
  comentario?: string;
}
