import { Controller, Get, Query } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('cola')
  getQueue(@Query() query: Record<string, unknown>) {
    return this.whatsappService.getQueue(query);
  }
}
