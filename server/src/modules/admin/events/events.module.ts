import { Module } from '@nestjs/common';
import { EventsController } from './http/events.controller';
import { EventsService } from './core/events.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
