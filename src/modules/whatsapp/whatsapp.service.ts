import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsappService {
  getQueue(query: Record<string, unknown>) {
    return { message: 'Cola de WhatsApp pendiente de implementar', query };
  }
}
