import { Module } from '@nestjs/common';
import { ParticipantsController } from './http/participants.controller';
import { ParticipantsService } from './core/participants.service';
import { EventsService } from '../events/core/events.service';

@Module({
  controllers: [ParticipantsController],
  providers: [EventsService, ParticipantsService],
})
export class ParticipantsModule {}
