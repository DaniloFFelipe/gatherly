import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ParticipantsService } from '../core/participants.service';
import { Public } from 'src/lib/auth/auth.metadata';
import { ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { JoinDto } from '../core/dtos/join.dto';

@Controller('client/participants')
@ApiTags('client')
@UsePipes(ZodValidationPipe)
export class ParticipantsController {
  constructor(private service: ParticipantsService) {}

  @Post('join')
  @Public()
  join(@Body() data: JoinDto) {
    return this.service.join(data);
  }
}
