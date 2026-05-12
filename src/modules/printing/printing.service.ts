import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PDFDocument = require('pdfkit');
import { Response } from 'express';
import { ReprintDto } from './dto/reprint.dto';
import { RequestEntity } from '../requests/request.entity';
import { RequestHistoryEntity } from '../requests/request-history.entity';

@Injectable()
export class PrintingService {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestsRepository: Repository<RequestEntity>,

    @InjectRepository(RequestHistoryEntity)
    private readonly historyRepository: Repository<RequestHistoryEntity>,
  ) {}

  private async findRequest(id: string): Promise<RequestEntity> {
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

  async print(id: string, user: any): Promise<RequestEntity> {
    const request = await this.findRequest(id);

    if (request.estado !== 'AUTORIZADA') {
      throw new BadRequestException('Solo se pueden imprimir solicitudes autorizadas');
    }

    const estadoAnterior = request.estado;

    request.estado = 'FINALIZADA';
    request.impreso_por = user.sub;
    request.fecha_impresion = new Date();
    request.cantidad_impresiones = (request.cantidad_impresiones ?? 0) + 1;

    const savedRequest = await this.requestsRepository.save(request);

    await this.saveHistory({
      solicitud_id: savedRequest.id,
      usuario_id: user.sub,
      accion: 'IMPRESION',
      estado_anterior: estadoAnterior,
      estado_nuevo: 'FINALIZADA',
      comentario: 'Solicitud impresa por técnico.',
    });

    return savedRequest;
  }

  async reprint(id: string, reprintDto: ReprintDto, user: any): Promise<RequestEntity> {
    const request = await this.findRequest(id);

    if (request.estado !== 'FINALIZADA') {
      throw new BadRequestException('Solo se pueden reimprimir solicitudes finalizadas');
    }

    request.impreso_por = user.sub;
    request.fecha_impresion = new Date();
    request.cantidad_impresiones = (request.cantidad_impresiones ?? 0) + 1;

    const savedRequest = await this.requestsRepository.save(request);

    await this.saveHistory({
      solicitud_id: savedRequest.id,
      usuario_id: user.sub,
      accion: 'REIMPRESION',
      estado_anterior: 'FINALIZADA',
      estado_nuevo: 'FINALIZADA',
      comentario: reprintDto.motivo ?? 'Solicitud reimpresa.',
    });

    return savedRequest;
  }

  getPrintHistory(id: string) {
    return this.historyRepository.find({
      where: {
        solicitud_id: id,
        accion: 'IMPRESION',
      },
      order: {
        fecha_creacion: 'DESC',
      },
    });
  }

  async getPdf(id: string, res: Response) {
  const request = await this.findRequest(id);

  const doc = new PDFDocument({
    margin: 40,
    size: 'A4',
  });

  res.setHeader('Content-Type', 'application/pdf');

  res.setHeader(
    'Content-Disposition',
    `inline; filename=solicitud-${request.numero_solicitud}.pdf`,
  );

  doc.pipe(res);

  doc.fontSize(22).text('SOLICITUD FRIO/CALOR', {
    align: 'center',
  });

  doc.moveDown();

  doc.fontSize(14).text(`Numero: ${request.numero_solicitud}`);
  doc.text(`Estado: ${request.estado}`);
  doc.text(`Tipo: ${request.tipo_solicitud}`);
  doc.text(`Cliente: ${request.codigo_cliente}`);
  doc.text(`Telefono: ${request.telefono ?? '-'}`);
  doc.text(`Reparto: ${request.reparto ?? '-'}`);

  doc.moveDown();

  doc.fontSize(16).text('Observacion del repartidor');

  doc.moveDown(0.5);

  doc.fontSize(12).text(
    request.observacion_repartidor ?? '-',
    {
      align: 'left',
    },
  );

  doc.moveDown();

  doc.fontSize(16).text('Comentario administrativo');

  doc.moveDown(0.5);

  doc.fontSize(12).text(
    request.comentario_administracion ?? '-',
    {
      align: 'left',
    },
  );

  doc.moveDown(2);

  doc.fontSize(10).text(
    `Fecha impresion: ${new Date().toLocaleString()}`,
    {
      align: 'right',
    },
  );

  doc.end();
}
}