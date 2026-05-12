import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RequestHistoryEntity } from '../requests/request-history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(RequestHistoryEntity)
    private readonly historyRepository: Repository<RequestHistoryEntity>,
  ) {}

  getHistory(id: string) {
    return this.historyRepository.find({
  relations: {
    usuario: {
      rol: true,
    },
  },
  select: {
    id: true,
    solicitud_id: true,
    usuario_id: true,
    accion: true,
    estado_anterior: true,
    estado_nuevo: true,
    comentario: true,
    fecha_creacion: true,
    usuario: {
      id: true,
      id_usuario: true,
      nombre_visible: true,
      reparto: true,
      rol: {
        id: true,
        nombre: true,
        descripcion: true,
      },
    },
  },
  where: {
    solicitud_id: id,
  },
  order: {
    fecha_creacion: 'DESC',
  },
});
  }
}