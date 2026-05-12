import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RequestType } from 'src/modules/common/enums/request-type.enum';

export class CreateRequestDto {
  @IsEnum(RequestType)
  tipoSolicitud!: RequestType;

  @IsString()
  codigoCliente!: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  observacionRepartidor?: string;
}
