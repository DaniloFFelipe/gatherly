import { Controller, Delete, Get, Param, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, ICurrentUser } from 'src/lib/auth/current-user.decorator';
import { MembersService } from '../core/members.service';

@Controller('admin/orgs/:slug')
@ApiTags('admin')
@UsePipes(ZodValidationPipe)
export class MembersController {
  constructor(private service: MembersService) {}

  @Get('/members')
  getMembers(
    @Param('slug') slug: string,
    @CurrentUser() { sub }: ICurrentUser,
  ) {
    return this.service.getMembers(slug, sub);
  }

  @Delete('/members/:memberId')
  removeMembers(
    @Param('slug') slug: string,
    @Param('memberId') memberId: string,
    @CurrentUser() { sub }: ICurrentUser,
  ) {
    return this.service.removeMember(memberId, slug, sub);
  }
}
