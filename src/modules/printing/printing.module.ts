import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PrintingController } from './printing.controller';
import { PrintingService } from './printing.service';
import { RequestEntity } from '../requests/request.entity';
import { RequestHistoryEntity } from '../requests/request-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity, RequestHistoryEntity])],
  controllers: [PrintingController],
  providers: [PrintingService],
})
export class PrintingModule {}