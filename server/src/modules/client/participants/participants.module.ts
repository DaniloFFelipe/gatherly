import { Module } from '@nestjs/common';
import { ParticipantsController } from './http/participants.controller';
import { ParticipantsService } from './core/participants.service';

@Module({
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
})
export class ParticipantsModule {}
