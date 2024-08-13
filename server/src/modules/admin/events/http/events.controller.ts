import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, ICurrentUser } from 'src/lib/auth/current-user.decorator';
import { EventsService } from '../core/events.service';
import { CreateEventDto } from '../core/dtos/create-event.dto';
import { UpdateEventDto } from '../core/dtos/update-event.dto';
import { Pagination } from 'src/modules/common/types/pagination';

@Controller('admin/orgs/:slug')
@ApiTags('admin')
@UsePipes(ZodValidationPipe)
export class EventsController {
  constructor(private service: EventsService) {}

  @Post('/events')
  @ApiCreatedResponse({
    type: CreateEventDto,
  })
  createEvent(
    @Body() data: CreateEventDto,
    @CurrentUser() { sub }: ICurrentUser,
    @Param('slug') slug: string,
  ) {
    return this.service.createEvent(slug, sub, data);
  }

  @Post('/events/:eventSlug')
  @ApiCreatedResponse({
    type: UpdateEventDto,
  })
  updateEvent(
    @Body() data: UpdateEventDto,
    @Param('slug') slug: string,
    @Param('eventSlug') eventSlug: string,
    @CurrentUser() { sub }: ICurrentUser,
  ) {
    return this.service.updateEvent(eventSlug, slug, sub, data);
  }

  @Get('/events/:eventSlug')
  getEvent(
    @Param('slug') slug: string,
    @Param('eventSlug') eventSlug: string,
    @CurrentUser() { sub }: ICurrentUser,
  ) {
    return this.service.getEvent(eventSlug, slug, sub);
  }

  @Get('/events')
  getEvents(
    @Param('slug') slug: string,
    @CurrentUser() { sub }: ICurrentUser,
    @Query() pagination: Pagination,
  ) {
    return this.service.getEvents(slug, sub, pagination);
  }
}
