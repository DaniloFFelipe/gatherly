import { Module } from '@nestjs/common';
import { EventsController } from './http/events.controller';
import { LessonsController } from './http/lessons.controller';
import { EventsService } from './core/events.service';
import { LessonsService } from './core/lessons.service';

@Module({
  controllers: [EventsController, LessonsController],
  providers: [EventsService, LessonsService],
})
export class EventsModule {}
