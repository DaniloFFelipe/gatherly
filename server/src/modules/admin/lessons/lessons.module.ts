import { Module } from '@nestjs/common';
import { LessonsController } from './http/lessons.controller';
import { LessonsService } from './core/lessons.service';
import { EventsService } from '../events/core/events.service';

@Module({
  controllers: [LessonsController],
  providers: [EventsService, LessonsService],
})
export class LessonsModule {}
