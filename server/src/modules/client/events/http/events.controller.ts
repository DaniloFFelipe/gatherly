import { Controller, Get, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { EventsService } from '../core/events.service';
import { CurrentUser, ICurrentUser } from 'src/lib/auth/current-user.decorator';

@Controller('client/events')
@ApiTags('client')
@UsePipes(ZodValidationPipe)
export class EventsController {
  constructor(private service: EventsService) {}

  @Get()
  getEventDetails(@CurrentUser() { sub }: ICurrentUser) {
    return this.service.getEventDetails(sub);
  }
}
