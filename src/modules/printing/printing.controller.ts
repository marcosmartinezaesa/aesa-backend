import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { PrintingService } from './printing.service';
import { ReprintDto } from './dto/reprint.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('solicitudes')
export class PrintingController {
  constructor(private readonly printingService: PrintingService) {}

  @Roles('TECNICO', 'ADMIN_GENERAL')
  @Post(':id/imprimir')
  print(@Param('id') id: string, @Req() req: Request) {
    return this.printingService.print(id, req.user);
  }

  @Roles('TECNICO', 'ADMIN_GENERAL')
  @Post(':id/reimprimir')
  reprint(@Param('id') id: string, @Body() reprintDto: ReprintDto, @Req() req: Request) {
    return this.printingService.reprint(id, reprintDto, req.user);
  }

  @Roles('TECNICO', 'ADMINISTRACION', 'ADMIN_GENERAL')
  @Get(':id/impresiones')
  getPrintHistory(@Param('id') id: string) {
    return this.printingService.getPrintHistory(id);
  }

  @Roles('TECNICO', 'ADMINISTRACION', 'ADMIN_GENERAL')
  @Get(':id/pdf')
getPdf(@Param('id') id: string, @Res() res: Response) {
  return this.printingService.getPdf(id, res);
}
}