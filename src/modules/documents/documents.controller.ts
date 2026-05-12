import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('solicitudes/:id/documentos')
  upload(@Param('id') id: string) {
    return this.documentsService.upload(id);
  }

  @Get('documentos/:id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Delete('documentos/:id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
