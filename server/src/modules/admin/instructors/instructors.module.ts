import { Module } from '@nestjs/common';
import { InstructorsController } from './http/instructors.controller';
import { InstructorsService } from './core/instructors.service';

@Module({
  controllers: [InstructorsController],
  providers: [InstructorsService],
})
export class InstructorsModule {}
