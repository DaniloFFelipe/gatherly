import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OrgsModule } from './orgs/orgs.module';
import { PermissionsModule } from '../common/roles/permissions.module';
import { EventsModule } from './events/events.module';
import { LessonsModule } from './lessons/lessons.module';
import { InstructorsModule } from './instructors/instructors.module';
import { MembersModule } from './members/members.module';
import { ParticipantsModule } from './participants/paticipants.module';

@Module({
  imports: [
    PermissionsModule,
    UsersModule,
    OrgsModule,
    EventsModule,
    LessonsModule,
    InstructorsModule,
    MembersModule,
    ParticipantsModule,
  ],
})
export class AdminModule {}
