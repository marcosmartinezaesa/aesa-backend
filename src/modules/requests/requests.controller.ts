import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestActionDto } from './dto/request-action.dto';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('solicitudes')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  async findAll() {
    return this.requestsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Roles('REPARTIDOR', 'ADMINISTRACION', 'ADMIN_GENERAL')
  @Post()
  async create(@Body() createRequestDto: CreateRequestDto, @Req() req: Request) {
    return this.requestsService.create(createRequestDto, req.user);
  }

  @Roles('ADMINISTRACION', 'ADMIN_GENERAL')
  @Post(':id/aprobar')
async approve(
  @Param('id') id: string,
  @Body() actionDto: RequestActionDto,
  @Req() req: Request,
) {
  return this.requestsService.approve(id, actionDto, req.user);
}

@Roles('ADMINISTRACION', 'ADMIN_GENERAL')
@Post(':id/rechazar')
async reject(
  @Param('id') id: string,
  @Body() actionDto: RequestActionDto,
  @Req() req: Request,
) {
  return this.requestsService.reject(id, actionDto, req.user);
}
}