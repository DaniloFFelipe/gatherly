import { Module } from '@nestjs/common';
import { MembersService } from './core/members.service';
import { MembersController } from './http/members.controller';

@Module({
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
