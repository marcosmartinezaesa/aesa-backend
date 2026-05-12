import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RequestEntity } from './request.entity';
import { RequestHistoryEntity } from './request-history.entity';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestsRepository: Repository<RequestEntity>,

    @InjectRepository(RequestHistoryEntity)
    private readonly historyRepository: Repository<RequestHistoryEntity>,
  ) {}

  async findAll(): Promise<RequestEntity[]> {
    return this.requestsRepository.find({
      order: {
        fecha_creacion: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<RequestEntity> {
    const request = await this.requestsRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return request;
  }

  private async saveHistory(data: {
    solicitud_id: string;
    usuario_id: string;
    accion: string;
    estado_anterior?: string | null;
    estado_nuevo?: string | null;
    comentario?: string | null;
  }) {
    const history = new RequestHistoryEntity();

    history.id = crypto.randomUUID();
    history.solicitud_id = data.solicitud_id;
    history.usuario_id = data.usuario_id;
    history.accion = data.accion;
    history.estado_anterior = data.estado_anterior ?? undefined;
    history.estado_nuevo = data.estado_nuevo ?? undefined;
    history.comentario = data.comentario ?? undefined;

    await this.historyRepository.save(history);
  }

  async create(createRequestDto: CreateRequestDto, user: any): Promise<RequestEntity> {
    const count = await this.requestsRepository.count();
    const nextNumber = count + 1;
    const numeroSolicitud = `FC-2026-${String(nextNumber).padStart(6, '0')}`;

    const request = this.requestsRepository.create({
      id: crypto.randomUUID(),
      numero_solicitud: numeroSolicitud,
      tipo_solicitud: createRequestDto.tipoSolicitud,
      codigo_cliente: createRequestDto.codigoCliente,
      telefono: createRequestDto.telefono,
      observacion_repartidor: createRequestDto.observacionRepartidor,
      estado: 'PENDIENTE',
      reparto: user?.reparto ?? null,
      creado_por: user.sub,
      cantidad_impresiones: 0,
    });

    const savedRequest = await this.requestsRepository.save(request);

    await this.saveHistory({
      solicitud_id: savedRequest.id,
      usuario_id: user.sub,
      accion: 'CREACION',
      estado_anterior: null,
      estado_nuevo: 'PENDIENTE',
      comentario: 'Solicitud creada desde API.',
    });

    return savedRequest;
  }

  async approve(id: string, actionDto: any, user: any): Promise<RequestEntity> {
    const request = await this.findOne(id);
    const estadoAnterior = request.estado;

    request.estado = 'AUTORIZADA';
    request.comentario_administracion = actionDto.comentario ?? null;
    request.autorizado_por = user.sub;
    request.fecha_autorizacion = new Date();

    const savedRequest = await this.requestsRepository.save(request);

    await this.saveHistory({
      solicitud_id: savedRequest.id,
      usuario_id: user.sub,
      accion: 'APROBACION',
      estado_anterior: estadoAnterior,
      estado_nuevo: 'AUTORIZADA',
      comentario: actionDto.comentario ?? 'Solicitud aprobada.',
    });

    return savedRequest;
  }

  async reject(id: string, actionDto: any, user: any): Promise<RequestEntity> {
    const request = await this.findOne(id);
    const estadoAnterior = request.estado;

    request.estado = 'RECHAZADA';
    request.comentario_administracion = actionDto.comentario ?? null;
    request.autorizado_por = user.sub;
    request.fecha_autorizacion = new Date();

    const savedRequest = await this.requestsRepository.save(request);

    await this.saveHistory({
      solicitud_id: savedRequest.id,
      usuario_id: user.sub,
      accion: 'RECHAZO',
      estado_anterior: estadoAnterior,
      estado_nuevo: 'RECHAZADA',
      comentario: actionDto.comentario ?? 'Solicitud rechazada.',
    });

    return savedRequest;
  }
}