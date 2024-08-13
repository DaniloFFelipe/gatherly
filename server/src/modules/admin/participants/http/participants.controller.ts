import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, ICurrentUser } from 'src/lib/auth/current-user.decorator';
import { ParticipantsService } from '../core/participants.service';
import { CreateParticipantDto } from '../core/dto/create-participants.dto';
import { UpdateParticipantDto } from '../core/dto/update-participants.dto';

@Controller('admin/orgs/:slug/events/:eventSlug')
@ApiTags('admin')
@UsePipes(ZodValidationPipe)
export class ParticipantsController {
  constructor(private service: ParticipantsService) {}

  @Post('/participants')
  @ApiCreatedResponse({
    type: CreateParticipantDto,
  })
  createEvent(
    @Body() data: CreateParticipantDto,
    @CurrentUser() { sub }: ICurrentUser,
    @Param('slug') slug: string,
    @Param('eventSlug') eventSlug: string,
  ) {
    return this.service.createParticipant(slug, eventSlug, sub, data);
  }

  @Post('/participants/:id')
  @ApiCreatedResponse({
    type: UpdateParticipantDto,
  })
  updateEvent(
    @Body() data: UpdateParticipantDto,
    @Param('slug') slug: string,
    @Param('eventSlug') eventSlug: string,
    @Param('id') id: string,
    @CurrentUser() { sub }: ICurrentUser,
  ) {
    return this.service.updateParticipant(id, slug, eventSlug, sub, data);
  }

  @Delete('/participants/:id')
  removeEvent(
    @Param('slug') slug: string,
    @Param('eventSlug') eventSlug: string,
    @Param('id') id: string,
    @CurrentUser() { sub }: ICurrentUser,
  ) {
    return this.service.deleteParticipant(slug, eventSlug, id, sub);
  }

  @Get('/participants')
  getEvents(
    @Param('slug') slug: string,
    @CurrentUser() { sub }: ICurrentUser,
    @Param('eventSlug') eventSlug: string,
  ) {
    return this.service.getParticipants(slug, eventSlug, sub);
  }
}
