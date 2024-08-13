import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, ICurrentUser } from 'src/lib/auth/current-user.decorator';
import { LessonsService } from '../core/lessons.service';
import { CreateLessonDto } from '../core/dto/create-lesson.dto';
import { UpdateLessonDto } from '../core/dto/update-lesson.dto';

@Controller('admin/orgs/:slug/events/:eventSlug')
@ApiTags('admin')
@UsePipes(ZodValidationPipe)
export class LessonsController {
  constructor(private service: LessonsService) {}

  @Post('/lessons')
  @ApiCreatedResponse({
    type: CreateLessonDto,
  })
  createEvent(
    @Body() data: CreateLessonDto,
    @CurrentUser() { sub }: ICurrentUser,
    @Param('slug') slug: string,
    @Param('eventSlug') eventSlug: string,
  ) {
    return this.service.createLesson(slug, eventSlug, sub, data);
  }

  @Post('/lessons/:id')
  @ApiCreatedResponse({
    type: UpdateLessonDto,
  })
  updateEvent(
    @Body() data: UpdateLessonDto,
    @Param('slug') slug: string,
    @Param('eventSlug') eventSlug: string,
    @Param('id') id: string,
    @CurrentUser() { sub }: ICurrentUser,
  ) {
    return this.service.updateLesson(slug, eventSlug, id, sub, data);
  }

  @Get('/lessons/:id')
  getEvent(
    @Param('slug') slug: string,
    @Param('eventSlug') eventSlug: string,
    @Param('id') id: string,
    @CurrentUser() { sub }: ICurrentUser,
  ) {
    return this.service.getLesson(slug, eventSlug, id, sub);
  }

  @Get('/lessons')
  getEvents(
    @Param('slug') slug: string,
    @CurrentUser() { sub }: ICurrentUser,
    @Param('eventSlug') eventSlug: string,
  ) {
    return this.service.getLessons(slug, eventSlug, sub);
  }
}
