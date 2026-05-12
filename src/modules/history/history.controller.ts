import { Controller, Get, Param } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('solicitudes')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':id/historial')
  getHistory(@Param('id') id: string) {
    return this.historyService.getHistory(id);
  }
}
