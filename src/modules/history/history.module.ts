import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { RequestHistoryEntity } from '../requests/request-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestHistoryEntity])],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}