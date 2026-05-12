import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestHistoryEntity } from './request-history.entity';

import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { RequestEntity } from './request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity, RequestHistoryEntity])],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}