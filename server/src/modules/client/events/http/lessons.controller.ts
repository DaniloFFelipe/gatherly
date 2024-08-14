import { Controller, Get, Param, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { LessonsService } from '../core/lessons.service';

@Controller('client/lessons')
@ApiTags('client')
@UsePipes(ZodValidationPipe)
export class LessonsController {
  constructor(private service: LessonsService) {}

  @Get('/:id')
  getLessonDetails(@Param('id') id: string) {
    return this.service.getLesson(id);
  }
}
