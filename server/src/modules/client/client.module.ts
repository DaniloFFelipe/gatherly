import { Module } from '@nestjs/common';

import { ParticipantsModule } from './participants/participants.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [ParticipantsModule, EventsModule],
})
export class ClientModule {}
